export type ProfileRow = {
  id: string
  email: string
  display_name: string
  avatar: string | null
  bio: string | null
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export type CommentRow = {
  id: string
  page_key: string
  user_id: string
  content: string
  created_at: string
  updated_at: string | null
}

export type CommentReplyRow = {
  id: string
  comment_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string | null
}

export type CommentLikeRow = {
  id: string
  user_id: string
  comment_id: string | null
  reply_id: string | null
  created_at: string
}
