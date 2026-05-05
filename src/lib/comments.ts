import { assertSupabaseConfigured, supabase } from '@/lib/supabase'
import type { CommentLikeRow, CommentReplyRow, CommentRow, ProfileRow } from '@/lib/supabaseSchema'
import { getCurrentUser } from './auth'

export interface CommentReply {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: number
  updatedAt?: number
  likes: number
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: number
  updatedAt?: number
  likes: number
  replies: CommentReply[]
}

export interface CommentStats {
  total: number
  totalReplies: number
  totalLikes: number
  activeUsers: number
  discussionCount: number
}

export interface UserCommentSummary {
  totalComments: number
  totalReplies: number
  totalLikesReceived: number
}

export const COMMENT_LIMITS = {
  commentMinLength: 3,
  commentMaxLength: 300,
  replyMinLength: 2,
  replyMaxLength: 180,
}

export const COMMENTS_UPDATED_EVENT = 'comments-updated'
export const COMMENT_PAGE_KEY = 'global'

type CommentSubscription = {
  unsubscribe: () => void
}

type LegacyStoredReply = {
  id?: string
  userId?: string
  userName?: string
  userAvatar?: string
  content?: string
  createdAt?: number
  updatedAt?: number
  likes?: number
}

type LegacyStoredComment = {
  id?: string
  userId?: string
  userName?: string
  userAvatar?: string
  content?: string
  createdAt?: number
  updatedAt?: number
  likes?: number
  replies?: LegacyStoredReply[]
}

type ParsedLegacyComment = {
  fingerprint: string
  content: string
  createdAt: number
  replies: Array<{
    fingerprint: string
    content: string
    createdAt: number
  }>
}

const LEGACY_COMMENT_STORAGE_KEY = 'site_comments'
const LEGACY_MIGRATION_PREFIX = 'site_comments_migrated_v2'

let commentCache: Comment[] = []
let likedKeyCache = new Set<string>()

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function emitCommentUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(COMMENTS_UPDATED_EVENT, {
        detail: { at: Date.now() },
      }),
    )
  }
}

function normalizeContent(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function assertContentLength(content: string, min: number, max: number, label: string) {
  if (content.length < min) {
    throw new Error(`${label}至少需要 ${min} 个字。`)
  }

  if (content.length > max) {
    throw new Error(`${label}最多支持 ${max} 个字。`)
  }
}

function getLikeKey(commentId: string, replyId?: string) {
  return replyId ? `reply_${replyId}` : `comment_${commentId}`
}

function toTimestamp(value?: string | null) {
  return value ? new Date(value).getTime() : undefined
}

function getLegacyMigrationKey(userId: string) {
  return `${LEGACY_MIGRATION_PREFIX}:${userId}`
}

function getDefaultAvatar(name: string) {
  return name.charAt(0).toUpperCase()
}

function readLegacyRawComments(): LegacyStoredComment[] {
  if (!canUseStorage()) {
    return []
  }

  const raw = window.localStorage.getItem(LEGACY_COMMENT_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as LegacyStoredComment[]) : []
  } catch {
    return []
  }
}

function makeLegacyFingerprint(parts: Array<string | number | undefined>) {
  return parts
    .map((part) => String(part ?? '').trim())
    .join('::')
    .replace(/\s+/g, ' ')
}

function parseLegacyCommentsForMigration() {
  const rawComments = readLegacyRawComments()

  return rawComments
    .map((comment, commentIndex) => {
      const content = normalizeContent(comment.content || '')
      if (!content) {
        return null
      }

      const createdAt = typeof comment.createdAt === 'number' ? comment.createdAt : Date.now() - commentIndex
      const replies = Array.isArray(comment.replies)
        ? comment.replies
            .map((reply, replyIndex) => {
              const replyContent = normalizeContent(reply.content || '')
              if (!replyContent) {
                return null
              }

              const replyCreatedAt = typeof reply.createdAt === 'number' ? reply.createdAt : createdAt + replyIndex + 1

              return {
                fingerprint: makeLegacyFingerprint(['reply', reply.id, replyContent, replyCreatedAt]),
                content: replyContent,
                createdAt: replyCreatedAt,
              }
            })
            .filter(Boolean) as ParsedLegacyComment['replies']
        : []

      return {
        fingerprint: makeLegacyFingerprint(['comment', comment.id, content, createdAt]),
        content,
        createdAt,
        replies,
      } satisfies ParsedLegacyComment
    })
    .filter(Boolean) as ParsedLegacyComment[]
}

function getMigratedLegacyFingerprints(userId: string) {
  if (!canUseStorage()) {
    return new Set<string>()
  }

  try {
    const raw = window.localStorage.getItem(getLegacyMigrationKey(userId))
    if (!raw) {
      return new Set<string>()
    }

    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed.map((item) => String(item)) : [])
  } catch {
    return new Set<string>()
  }
}

function saveMigratedLegacyFingerprints(userId: string, fingerprints: Set<string>) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(getLegacyMigrationKey(userId), JSON.stringify(Array.from(fingerprints)))
}

function clearLegacyCommentStorageIfMigrated(userId: string) {
  if (!canUseStorage()) {
    return
  }

  const legacyComments = parseLegacyCommentsForMigration()
  const migrated = getMigratedLegacyFingerprints(userId)
  const allFingerprints = legacyComments.flatMap((comment) => [comment.fingerprint, ...comment.replies.map((reply) => reply.fingerprint)])

  if (allFingerprints.length > 0 && allFingerprints.every((fingerprint) => migrated.has(fingerprint))) {
    window.localStorage.removeItem(LEGACY_COMMENT_STORAGE_KEY)
  }
}

function mapComments(
  comments: CommentRow[],
  replies: CommentReplyRow[],
  profiles: ProfileRow[],
  likes: CommentLikeRow[],
  currentUserId?: string,
) {
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]))
  const commentLikeCount = new Map<string, number>()
  const replyLikeCount = new Map<string, number>()
  const nextLikedKeys = new Set<string>()

  likes.forEach((like) => {
    if (like.comment_id) {
      commentLikeCount.set(like.comment_id, (commentLikeCount.get(like.comment_id) ?? 0) + 1)
      if (currentUserId && like.user_id === currentUserId) {
        nextLikedKeys.add(getLikeKey(like.comment_id))
      }
    }

    if (like.reply_id) {
      replyLikeCount.set(like.reply_id, (replyLikeCount.get(like.reply_id) ?? 0) + 1)
      if (currentUserId && like.user_id === currentUserId) {
        nextLikedKeys.add(getLikeKey('', like.reply_id))
      }
    }
  })

  likedKeyCache = nextLikedKeys

  const repliesByComment = new Map<string, CommentReply[]>()

  replies.forEach((reply) => {
    const profile = profileMap.get(reply.user_id)
    const name = profile?.display_name || '匿名用户'
    const mappedReply: CommentReply = {
      id: reply.id,
      userId: reply.user_id,
      userName: name,
      userAvatar: profile?.avatar || getDefaultAvatar(name),
      content: reply.content,
      createdAt: new Date(reply.created_at).getTime(),
      updatedAt: toTimestamp(reply.updated_at),
      likes: replyLikeCount.get(reply.id) ?? 0,
    }

    const bucket = repliesByComment.get(reply.comment_id) ?? []
    bucket.push(mappedReply)
    repliesByComment.set(reply.comment_id, bucket)
  })

  commentCache = comments
    .map((comment) => {
      const profile = profileMap.get(comment.user_id)
      const name = profile?.display_name || '匿名用户'

      return {
        id: comment.id,
        userId: comment.user_id,
        userName: name,
        userAvatar: profile?.avatar || getDefaultAvatar(name),
        content: comment.content,
        createdAt: new Date(comment.created_at).getTime(),
        updatedAt: toTimestamp(comment.updated_at),
        likes: commentLikeCount.get(comment.id) ?? 0,
        replies: (repliesByComment.get(comment.id) ?? []).sort((a, b) => a.createdAt - b.createdAt),
      } satisfies Comment
    })
    .sort((a, b) => b.createdAt - a.createdAt)

  return commentCache
}

async function fetchCloudComments(pageKey = COMMENT_PAGE_KEY) {
  const client = assertSupabaseConfigured()
  const currentUserId = getCurrentUser()?.id

  const { data: commentRows, error: commentsError } = await client
    .from('comments')
    .select('*')
    .eq('page_key', pageKey)
    .order('created_at', { ascending: false })

  if (commentsError) {
    throw new Error(commentsError.message)
  }

  const comments = (commentRows ?? []) as CommentRow[]
  const commentIds = comments.map((comment) => comment.id)

  const { data: replyRows, error: repliesError } = commentIds.length
    ? await client.from('comment_replies').select('*').in('comment_id', commentIds).order('created_at', { ascending: true })
    : { data: [], error: null }

  if (repliesError) {
    throw new Error(repliesError.message)
  }

  const replies = (replyRows ?? []) as CommentReplyRow[]
  const replyIds = replies.map((reply) => reply.id)

  const [{ data: commentLikeRows, error: commentLikesError }, { data: replyLikeRows, error: replyLikesError }] = await Promise.all([
    commentIds.length ? client.from('comment_likes').select('*').in('comment_id', commentIds) : Promise.resolve({ data: [], error: null }),
    replyIds.length ? client.from('comment_likes').select('*').in('reply_id', replyIds) : Promise.resolve({ data: [], error: null }),
  ])

  if (commentLikesError) {
    throw new Error(commentLikesError.message)
  }

  if (replyLikesError) {
    throw new Error(replyLikesError.message)
  }

  const likes = [...((commentLikeRows ?? []) as CommentLikeRow[]), ...((replyLikeRows ?? []) as CommentLikeRow[])]
  const profileIds = Array.from(new Set([...comments.map((item) => item.user_id), ...replies.map((item) => item.user_id)]))

  const { data: profileRows, error: profilesError } = profileIds.length
    ? await client.from('profiles').select('*').in('id', profileIds)
    : { data: [], error: null }

  if (profilesError) {
    throw new Error(profilesError.message)
  }

  return mapComments(comments, replies, (profileRows ?? []) as ProfileRow[], likes, currentUserId)
}

export async function listComments(pageKey = COMMENT_PAGE_KEY) {
  const mapped = await fetchCloudComments(pageKey)
  emitCommentUpdate()
  return mapped
}

export function getAllComments() {
  return commentCache
}

export async function migrateLegacyCommentsToCloud(pageKey = COMMENT_PAGE_KEY) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    return { migratedCount: 0 }
  }

  const legacyComments = parseLegacyCommentsForMigration()
  if (legacyComments.length === 0) {
    return { migratedCount: 0 }
  }

  const migratedFingerprints = getMigratedLegacyFingerprints(currentUser.id)
  const client = assertSupabaseConfigured()
  let migratedCount = 0

  for (const legacyComment of legacyComments) {
    if (migratedFingerprints.has(legacyComment.fingerprint)) {
      continue
    }

    const { data: insertedComment, error: insertCommentError } = await client
      .from('comments')
      .insert({
        page_key: pageKey,
        user_id: currentUser.id,
        content: legacyComment.content,
      })
      .select('id')
      .single()

    if (insertCommentError) {
      throw new Error(`旧评论迁移失败：${insertCommentError.message}`)
    }

    migratedFingerprints.add(legacyComment.fingerprint)
    migratedCount += 1

    for (const legacyReply of legacyComment.replies) {
      if (migratedFingerprints.has(legacyReply.fingerprint)) {
        continue
      }

      const { error: insertReplyError } = await client.from('comment_replies').insert({
        comment_id: insertedComment.id,
        user_id: currentUser.id,
        content: legacyReply.content,
      })

      if (insertReplyError) {
        throw new Error(`旧回复迁移失败：${insertReplyError.message}`)
      }

      migratedFingerprints.add(legacyReply.fingerprint)
      migratedCount += 1
    }
  }

  saveMigratedLegacyFingerprints(currentUser.id, migratedFingerprints)
  clearLegacyCommentStorageIfMigrated(currentUser.id)

  if (migratedCount > 0) {
    await listComments(pageKey)
  }

  return { migratedCount }
}

export async function createComment(pageKey: string, content: string) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('请先登录后再发表评论。')
  }

  const normalizedContent = normalizeContent(content)
  assertContentLength(normalizedContent, COMMENT_LIMITS.commentMinLength, COMMENT_LIMITS.commentMaxLength, '评论内容')

  const client = assertSupabaseConfigured()
  const { error } = await client.from('comments').insert({
    page_key: pageKey,
    user_id: currentUser.id,
    content: normalizedContent,
  })

  if (error) {
    throw new Error(error.message)
  }

  await listComments(pageKey)
}

export async function addComment(userId: string, userName: string, content: string) {
  void userId
  void userName
  await createComment(COMMENT_PAGE_KEY, content)
}

export async function updateComment(commentId: string, userId: string, content: string) {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.id !== userId) {
    return null
  }

  const normalizedContent = normalizeContent(content)
  assertContentLength(normalizedContent, COMMENT_LIMITS.commentMinLength, COMMENT_LIMITS.commentMaxLength, '评论内容')

  const client = assertSupabaseConfigured()
  const { error } = await client
    .from('comments')
    .update({
      content: normalizedContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .eq('user_id', currentUser.id)

  if (error) {
    throw new Error(error.message)
  }

  await listComments(COMMENT_PAGE_KEY)
  return commentCache.find((comment) => comment.id === commentId) ?? null
}

export async function addReply(commentId: string, userId: string, userName: string, content: string) {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.id !== userId) {
    return null
  }

  void userName

  const normalizedContent = normalizeContent(content)
  assertContentLength(normalizedContent, COMMENT_LIMITS.replyMinLength, COMMENT_LIMITS.replyMaxLength, '回复内容')

  const client = assertSupabaseConfigured()
  const { error } = await client.from('comment_replies').insert({
    comment_id: commentId,
    user_id: currentUser.id,
    content: normalizedContent,
  })

  if (error) {
    throw new Error(error.message)
  }

  await listComments(COMMENT_PAGE_KEY)
  return commentCache.flatMap((comment) => comment.replies).find((reply) => reply.content === normalizedContent && reply.userId === currentUser.id) ?? null
}

export async function updateReply(commentId: string, replyId: string, userId: string, content: string) {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.id !== userId) {
    return null
  }

  void commentId

  const normalizedContent = normalizeContent(content)
  assertContentLength(normalizedContent, COMMENT_LIMITS.replyMinLength, COMMENT_LIMITS.replyMaxLength, '回复内容')

  const client = assertSupabaseConfigured()
  const { error } = await client
    .from('comment_replies')
    .update({
      content: normalizedContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', replyId)
    .eq('user_id', currentUser.id)

  if (error) {
    throw new Error(error.message)
  }

  await listComments(COMMENT_PAGE_KEY)
  return commentCache.flatMap((comment) => comment.replies).find((reply) => reply.id === replyId) ?? null
}

export async function toggleLikeComment(commentId: string, replyId?: string) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('请先登录后再点赞。')
  }

  const client = assertSupabaseConfigured()
  const isLiked = hasLiked(commentId, replyId)

  if (isLiked) {
    let query = client.from('comment_likes').delete().eq('user_id', currentUser.id)
    query = replyId ? query.eq('reply_id', replyId) : query.eq('comment_id', commentId)
    const { error } = await query
    if (error) {
      throw new Error(error.message)
    }
  } else {
    const { error } = await client.from('comment_likes').insert({
      user_id: currentUser.id,
      comment_id: replyId ? null : commentId,
      reply_id: replyId ?? null,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  await listComments(COMMENT_PAGE_KEY)
  return !isLiked
}

export async function deleteComment(commentId: string, userId: string) {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.id !== userId) {
    return false
  }

  const client = assertSupabaseConfigured()
  const { error } = await client.from('comments').delete().eq('id', commentId).eq('user_id', currentUser.id)

  if (error) {
    throw new Error(error.message)
  }

  await listComments(COMMENT_PAGE_KEY)
  return true
}

export async function deleteReply(commentId: string, replyId: string, userId: string) {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.id !== userId) {
    return false
  }

  void commentId

  const client = assertSupabaseConfigured()
  const { error } = await client.from('comment_replies').delete().eq('id', replyId).eq('user_id', currentUser.id)

  if (error) {
    throw new Error(error.message)
  }

  await listComments(COMMENT_PAGE_KEY)
  return true
}

export function syncCommentsForUser() {
  emitCommentUpdate()
}

export async function getCommentStats() {
  return {
    total: commentCache.length,
    totalReplies: commentCache.reduce((sum, comment) => sum + comment.replies.length, 0),
    totalLikes: commentCache.reduce((sum, comment) => sum + comment.likes + comment.replies.reduce((replySum, reply) => replySum + reply.likes, 0), 0),
    activeUsers: new Set(commentCache.flatMap((comment) => [comment.userId, ...comment.replies.map((reply) => reply.userId)])).size,
    discussionCount: commentCache.filter((comment) => comment.replies.length > 0).length,
  } satisfies CommentStats
}

export async function getUserComments(userId: string) {
  if (!commentCache.length) {
    await listComments(COMMENT_PAGE_KEY)
  }

  return commentCache.filter((comment) => comment.userId === userId)
}

export async function getUserCommentSummary(userId: string) {
  const comments = await getUserComments(userId)
  const replies = commentCache.flatMap((comment) => comment.replies.filter((reply) => reply.userId === userId))

  return {
    totalComments: comments.length,
    totalReplies: replies.length,
    totalLikesReceived: comments.reduce((sum, comment) => sum + comment.likes, 0) + replies.reduce((sum, reply) => sum + reply.likes, 0),
  } satisfies UserCommentSummary
}

export function hasLiked(commentId: string, replyId?: string) {
  return likedKeyCache.has(getLikeKey(commentId, replyId))
}

export function formatCommentTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < week) return `${Math.floor(diff / day)} 天前`
  if (diff < month) return `${Math.floor(diff / week)} 周前`
  if (diff < 12 * month) return `${Math.floor(diff / month)} 个月前`

  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function subscribeComments(pageKey: string, callback: () => void): CommentSubscription {
  if (!supabase) {
    return { unsubscribe: () => undefined }
  }

  const client = assertSupabaseConfigured()

  const channel = client
    .channel(`comments:${pageKey}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `page_key=eq.${pageKey}` }, async () => {
      await listComments(pageKey)
      callback()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comment_replies' }, async () => {
      await listComments(pageKey)
      callback()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comment_likes' }, async () => {
      await listComments(pageKey)
      callback()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
      await listComments(pageKey)
      callback()
    })
    .subscribe()

  return {
    unsubscribe: () => {
      void client.removeChannel(channel)
    },
  }
}
