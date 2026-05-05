import type { Session } from '@supabase/supabase-js'
import { assertSupabaseConfigured, supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/lib/supabaseSchema'

export interface AppUser {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export interface UserProfilePatch {
  name?: string
  avatar?: string
  bio?: string
}

type AuthStateMode = 'none' | 'guest' | 'user'
type AuthListener = (user: AppUser | null) => void

const GUEST_PROFILE_KEY = 'ancient-architecture-guest-profile'

let cachedUser: AppUser | null = null
let cachedMode: AuthStateMode = 'none'
let initialized = false
let authReady = false
const listeners = new Set<AuthListener>()

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function emitAuthUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-updated'))
    window.dispatchEvent(new CustomEvent('journey-updated'))
  }

  listeners.forEach((listener) => listener(cachedUser))
}

function normalizeAuthMessage(message: string) {
  const lower = message.toLowerCase()

  if (lower.includes('email not confirmed')) {
    return '该账号还没有完成邮箱确认。若这是在关闭 Confirm email 之前创建的旧账号，请到 Supabase 后台手动标记为已确认，或重新注册一个新账号。'
  }

  if (lower.includes('invalid login credentials')) {
    return '邮箱或密码不正确。'
  }

  if (lower.includes('user already registered')) {
    return '这个邮箱已经注册过了。'
  }

  if (lower.includes('signup is disabled')) {
    return '当前 Supabase 项目还没有开启注册功能。'
  }

  return message
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function readGuestProfile() {
  return readJson<{ name: string }>(GUEST_PROFILE_KEY, { name: '访客' })
}

function writeGuestProfile(profile: { name: string }) {
  writeJson(GUEST_PROFILE_KEY, profile)
  emitAuthUpdate()
}

function normalizeAppUser(profile: ProfileRow): AppUser {
  const name = profile.display_name?.trim() || '未命名用户'

  return {
    id: profile.id,
    name,
    email: profile.email,
    avatar: profile.avatar || name.charAt(0).toUpperCase(),
    bio: profile.bio || '',
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    lastLoginAt: profile.last_login_at || profile.updated_at || profile.created_at,
  }
}

async function fetchProfile(userId: string): Promise<AppUser | null> {
  const client = assertSupabaseConfigured()
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle<ProfileRow>()

  if (error) {
    throw new Error(error.message)
  }

  return data ? normalizeAppUser(data) : null
}

async function ensureProfile(session: Session, preferredName?: string) {
  const client = assertSupabaseConfigured()
  const existing = await fetchProfile(session.user.id)
  const now = new Date().toISOString()

  if (existing) {
    const { error } = await client
      .from('profiles')
      .update({
        email: session.user.email ?? existing.email,
        last_login_at: now,
        updated_at: now,
      })
      .eq('id', session.user.id)

    if (error) {
      throw new Error(error.message)
    }

    return (await fetchProfile(session.user.id)) as AppUser
  }

  const nameFromMeta = typeof session.user.user_metadata?.display_name === 'string' ? session.user.user_metadata.display_name : ''
  const displayName = preferredName?.trim() || nameFromMeta.trim() || session.user.email?.split('@')[0] || '未命名用户'

  const { error } = await client.from('profiles').insert({
    id: session.user.id,
    email: session.user.email ?? '',
    display_name: displayName,
    avatar: displayName.charAt(0).toUpperCase(),
    bio: '',
    created_at: now,
    updated_at: now,
    last_login_at: now,
  })

  if (error) {
    throw new Error(error.message)
  }

  return (await fetchProfile(session.user.id)) as AppUser
}

function applyUser(user: AppUser | null) {
  cachedUser = user
  cachedMode = user ? 'user' : 'none'
  emitAuthUpdate()
}

async function syncFromSession(session: Session | null) {
  authReady = true

  if (!session?.user) {
    cachedUser = null
    cachedMode = 'guest'
    emitAuthUpdate()
    return
  }

  const profile = await ensureProfile(session)
  cachedUser = profile
  cachedMode = 'user'
  emitAuthUpdate()
}

function initAuth() {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true

  if (!supabase) {
    authReady = true
    cachedUser = null
    cachedMode = 'guest'
    emitAuthUpdate()
    return
  }

  supabase.auth
    .getSession()
    .then(async ({ data }) => {
      await syncFromSession(data.session)
    })
    .catch(() => {
      authReady = true
      cachedUser = null
      cachedMode = 'guest'
      emitAuthUpdate()
    })

  supabase.auth.onAuthStateChange((_event, session) => {
    void syncFromSession(session)
  })
}

initAuth()

export function getUsers() {
  return []
}

export function getCurrentUser(): AppUser | null {
  return cachedUser
}

export function getCurrentSessionMode() {
  return cachedMode
}

export function isAuthReady() {
  return authReady
}

export function isAuthenticated() {
  return Boolean(cachedUser)
}

export function isGuestSession() {
  return cachedMode === 'guest'
}

export function getActiveProfileId() {
  return cachedUser?.id ?? 'guest'
}

export function getActiveProfileName() {
  return cachedUser?.name ?? (readGuestProfile().name || '访客')
}

export function getGuestProfile() {
  return readGuestProfile()
}

export function updateGuestProfile(input: { name: string }) {
  const name = input.name.trim()
  if (!name) {
    return { ok: false as const, message: '请输入访客昵称。' }
  }

  writeGuestProfile({ name })
  return { ok: true as const, profile: { name } }
}

export async function signUp(email: string, password: string, displayName: string) {
  const client = assertSupabaseConfigured()
  const nextEmail = email.trim().toLowerCase()
  const nextPassword = password.trim()
  const nextName = displayName.trim()

  if (!nextName) {
    return { ok: false as const, message: '请输入昵称。' }
  }

  if (!nextEmail) {
    return { ok: false as const, message: '请输入邮箱。' }
  }

  if (nextPassword.length < 6) {
    return { ok: false as const, message: '密码至少需要 6 位。' }
  }

  const { data, error } = await client.auth.signUp({
    email: nextEmail,
    password: nextPassword,
    options: {
      data: {
        display_name: nextName,
      },
    },
  })

  if (error) {
    return { ok: false as const, message: normalizeAuthMessage(error.message) }
  }

  if (!data.session) {
    return {
      ok: false as const,
      message: '注册成功，但当前 Supabase 仍要求邮箱确认，所以还不能直接登录。请检查 Authentication -> Providers -> Email 中的 Confirm email 设置，或改用一个新的已放开确认策略的账号重新注册。',
    }
  }

  const user = await ensureProfile(data.session, nextName)
  applyUser(user)
  return { ok: true as const, user }
}

export async function signIn(email: string, password: string) {
  const client = assertSupabaseConfigured()
  const nextEmail = email.trim().toLowerCase()
  const nextPassword = password

  if (!nextEmail) {
    return { ok: false as const, message: '请输入邮箱。' }
  }

  if (!nextPassword.trim()) {
    return { ok: false as const, message: '请输入密码。' }
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: nextEmail,
    password: nextPassword,
  })

  if (error) {
    return { ok: false as const, message: normalizeAuthMessage(error.message) }
  }

  if (!data.session) {
    return { ok: false as const, message: '登录失败，未拿到有效会话。' }
  }

  const user = await ensureProfile(data.session)
  applyUser(user)
  return { ok: true as const, user }
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  return signUp(input.email, input.password, input.name)
}

export async function loginUser(input: { email: string; password: string }) {
  return signIn(input.email, input.password)
}

export async function updateCurrentUserProfile(input: UserProfilePatch) {
  const currentUser = cachedUser
  if (!currentUser) {
    return { ok: false as const, message: '当前还没有登录。' }
  }

  const nextName = input.name?.trim() ?? currentUser.name
  const nextAvatar = input.avatar?.trim() ?? (currentUser.avatar || '')
  const nextBio = input.bio?.trim() ?? currentUser.bio ?? ''

  if (!nextName) {
    return { ok: false as const, message: '显示昵称不能为空。' }
  }

  const client = assertSupabaseConfigured()
  const now = new Date().toISOString()
  const { error } = await client
    .from('profiles')
    .update({
      display_name: nextName,
      avatar: nextAvatar || nextName.charAt(0).toUpperCase(),
      bio: nextBio,
      updated_at: now,
    })
    .eq('id', currentUser.id)

  if (error) {
    return { ok: false as const, message: error.message }
  }

  const user = await fetchProfile(currentUser.id)
  applyUser(user)
  return { ok: true as const, user: user as AppUser }
}

export function subscribeAuthState(callback: AuthListener) {
  listeners.add(callback)
  callback(cachedUser)
  return () => {
    listeners.delete(callback)
  }
}

export function enterGuestMode() {
  cachedUser = null
  cachedMode = 'guest'
  emitAuthUpdate()
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { ok: false as const, message: error.message }
    }
  }

  cachedUser = null
  cachedMode = 'none'
  emitAuthUpdate()
  return { ok: true as const }
}

export async function logoutUser() {
  return signOut()
}
