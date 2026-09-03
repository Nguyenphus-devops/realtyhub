export const HISTORY_ACTIONS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGIN_SUCCESS: 'user.login.success',
  USER_FORGOT_PASSWORD_REQUESTED: 'user.forgot-password.requested',
  USER_RESET_PASSWORD_SUCCESS: 'user.reset-password.success',
  BLOG_CREATED: 'blog.created',
  BLOG_UPDATED: 'blog.updated',
  BLOG_SOFT_DELETED: 'blog.soft-deleted',
  BLOG_HARD_DELETED: 'blog.hard-deleted',
  IMAGE_DELETED: 'image.deleted',
  VIDEO_DELETED: 'video.deleted',
  CATEGORIES_BLOG_CREATED: 'categories-blog.created',
  CATEGORIES_BLOG_UPDATED: 'categories-blog.updated',
  CATEGORIES_BLOG_SOFT_DELETED: 'categories-blog.soft-deleted',
  CATEGORIES_BLOG_HARD_DELETED: 'categories-blog.hard-deleted',
  CONTACT_SUBMITTED: 'contact.submitted',
  CONTACT_ADMIN_UPDATED: 'contact.admin-updated',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_BLOCKED: 'user.blocked',
  USER_UNBLOCKED: 'user.unblocked',
  USER_SOFT_DELETED: 'user.soft-deleted',
  USER_HARD_DELETED: 'user.hard-deleted',
} as const;

export type HistoryAction =
  (typeof HISTORY_ACTIONS)[keyof typeof HISTORY_ACTIONS];
