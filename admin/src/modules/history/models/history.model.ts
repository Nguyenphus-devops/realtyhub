export type HistoryLog = {
  _id: string;
  action: string;
  message?: string;
  actorId?: string;
  actorEmail?: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedHistoryLogs = {
  logs: HistoryLog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// Mirrors backend `history.ts` for filters and labels (keep in sync when adding actions)
export const HISTORY_ACTION_VALUES = [
  'user.registered',
  'user.login.success',
  'user.forgot-password.requested',
  'user.reset-password.success',
  'blog.created',
  'blog.updated',
  'blog.soft-deleted',
  'blog.hard-deleted',
  'image.deleted',
  'categories-blog.created',
  'categories-blog.updated',
  'categories-blog.soft-deleted',
  'categories-blog.hard-deleted',
  'contact.submitted',
  'contact.admin-updated',
] as const;

export type HistoryActionValue = (typeof HISTORY_ACTION_VALUES)[number];

export const HISTORY_ACTION_LABEL_VI: Record<string, string> = {
  'user.registered': 'Người dùng đăng ký',
  'user.login.success': 'Đăng nhập thành công',
  'user.forgot-password.requested': 'Yêu cầu quên mật khẩu',
  'user.reset-password.success': 'Đặt lại mật khẩu thành công',
  'blog.created': 'Tạo bài blog',
  'blog.updated': 'Cập nhật bài blog',
  'blog.soft-deleted': 'Xóa mềm bài blog',
  'blog.hard-deleted': 'Xóa vĩnh viễn bài blog',
  'image.deleted': 'Xóa hình ảnh',
  'categories-blog.created': 'Tạo danh mục blog',
  'categories-blog.updated': 'Cập nhật danh mục blog',
  'categories-blog.soft-deleted': 'Ẩn danh mục blog',
  'categories-blog.hard-deleted': 'Xóa vĩnh viễn danh mục blog',
  'contact.submitted': 'Khách gửi liên hệ / đặt chỗ',
  'contact.admin-updated': 'Admin cập nhật liên hệ',
};
