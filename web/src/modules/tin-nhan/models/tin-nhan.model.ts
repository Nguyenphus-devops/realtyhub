

export type ConversationStatus = 'online' | 'offline' | 'away';

export type ConversationChannel =
  | 'moi-gioi'
  | 'chu-dau-tu'
  | 'ho-tro'
  | 'khach-hang'
  | 'nhom';


export type MessageSender = 'me' | 'them' | 'system';

export type Conversation = {
  id: string;
  /** Ten hien thi doi phuong */
  name: string;
  /** Chan dung - chi dung khi co anh that, fallback PlaceholderThumb */
  avatarUrl?: string;
  /** Channel loai cuoc tro chuyen */
  channel: ConversationChannel;
  /** Trang thai online */
  status: ConversationStatus;
  /** Tin nhan gan nhat (preview) */
  lastMessage: string;
  /** Thoi gian tin nhan cuoi - duoc formatted o UI */
  lastMessageTime: string;
  /** ISO timestamp goc de sort */
  lastMessageAt: string;
  /** So tin nhan chua doc */
  unreadCount: number;
  /** Tin nhan cuoi do minh gui - canh bao UI */
  isOwnLastMessage?: boolean;
  /** Tick xanh - moi gioi chinh thuc */
  isVerified?: boolean;
  
  memberNames?: string[];
};

export type Message = {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  /** ISO timestamp */
  sentAt: string;
  /** Trang thai (doi voi 'me') */
  status?: 'sending' | 'sent' | 'delivered' | 'read';
};


export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-001',
    name: 'Anh Minh Tuấn',
    channel: 'moi-gioi',
    status: 'online',
    lastMessage: 'Dạ anh, căn 12B còn 1 suất cuối. Anh xem chiều nay được không?',
    lastMessageTime: '2 phút',
    lastMessageAt: '2026-08-09T09:25:00+07:00',
    unreadCount: 2,
    isVerified: true,
  },
  {
    id: 'c-002',
    name: 'Chị Hương Trà',
    channel: 'moi-gioi',
    status: 'online',
    lastMessage: 'Mình vừa gửi bảng giá mới nhất của phân khu A. Chị check giúp nhé!',
    lastMessageTime: '15 phút',
    lastMessageAt: '2026-08-09T09:12:00+07:00',
    unreadCount: 1,
    isVerified: true,
  },
  {
    id: 'c-003',
    name: 'Sun Group - Chủ đầu tư',
    channel: 'chu-dau-tu',
    status: 'online',
    lastMessage: 'Lễ mở bán Sun Riverside chính thức diễn ra 15/08. Anh chị quan tâm inbox nha.',
    lastMessageTime: '1 giờ',
    lastMessageAt: '2026-08-09T08:30:00+07:00',
    unreadCount: 3,
    isVerified: true,
  },
  {
    id: 'c-004',
    name: 'NovaLand Investment',
    channel: 'chu-dau-tu',
    status: 'away',
    lastMessage: 'Bạn: Cảm ơn anh, mình sẽ xem xét và phản hồi sớm ạ.',
    lastMessageTime: '2 giờ',
    lastMessageAt: '2026-08-09T07:30:00+07:00',
    unreadCount: 0,
    isOwnLastMessage: true,
    isVerified: true,
  },
  {
    id: 'c-005',
    name: 'Hỗ trợ RealtyHub',
    channel: 'ho-tro',
    status: 'online',
    lastMessage: 'Yêu cầu #2834 của anh đã được tiếp nhận. Chúng tôi sẽ phản hồi trong 24h.',
    lastMessageTime: 'Hôm qua',
    lastMessageAt: '2026-08-08T17:45:00+07:00',
    unreadCount: 0,
    isVerified: true,
  },
  {
    id: 'c-006',
    name: 'Anh Quốc Bảo',
    channel: 'khach-hang',
    status: 'offline',
    lastMessage: 'Cảm ơn em, anh sẽ liên hệ lại sau.',
    lastMessageTime: 'Hôm qua',
    lastMessageAt: '2026-08-08T14:20:00+07:00',
    unreadCount: 0,
  },
  {
    id: 'c-007',
    name: 'Chị Mai Linh',
    channel: 'moi-gioi',
    status: 'offline',
    lastMessage: 'Bạn: Dạ vâng, chị gửi thêm hình ảnh phối cảnh cho em xem với ạ.',
    lastMessageTime: '2 ngày',
    lastMessageAt: '2026-08-07T10:15:00+07:00',
    unreadCount: 0,
    isOwnLastMessage: true,
  },
  {
    id: 'c-008',
    name: 'Vinhomes Support',
    channel: 'ho-tro',
    status: 'online',
    lastMessage: 'Chào anh/chị, mình có thể hỗ trợ gì cho mình ạ?',
    lastMessageTime: '3 ngày',
    lastMessageAt: '2026-08-06T09:00:00+07:00',
    unreadCount: 0,
    isVerified: true,
  },
];


export const SUGGESTED_CONTACTS: Conversation[] = [
  {
    id: 'p-001',
    name: 'Anh Đức Thắng',
    channel: 'moi-gioi',
    status: 'online',
    lastMessage: '',
    lastMessageTime: '',
    lastMessageAt: '2026-08-09T00:00:00+07:00',
    unreadCount: 0,
    isVerified: true,
  },
  {
    id: 'p-002',
    name: 'Chị Thu Hà',
    channel: 'khach-hang',
    status: 'offline',
    lastMessage: '',
    lastMessageTime: '',
    lastMessageAt: '2026-08-09T00:00:00+07:00',
    unreadCount: 0,
  },
  {
    id: 'p-003',
    name: 'Masterise Homes',
    channel: 'chu-dau-tu',
    status: 'online',
    lastMessage: '',
    lastMessageTime: '',
    lastMessageAt: '2026-08-09T00:00:00+07:00',
    unreadCount: 0,
    isVerified: true,
  },
  {
    id: 'p-004',
    name: 'Anh Hoàng Nam',
    channel: 'moi-gioi',
    status: 'away',
    lastMessage: '',
    lastMessageTime: '',
    lastMessageAt: '2026-08-09T00:00:00+07:00',
    unreadCount: 0,
  },
];


export const MESSAGES_BY_CONVERSATION: Record<string, Message[]> = {
  'c-001': [
    {
      id: 'm-001',
      conversationId: 'c-001',
      sender: 'them',
      content: 'Chào anh! Em là Minh Tuấn, môi giới phụ trách dự án Vinhomes Grand Park.',
      sentAt: '2026-08-09T09:00:00+07:00',
    },
    {
      id: 'm-002',
      conversationId: 'c-001',
      sender: 'me',
      content: 'Chào Tuấn, anh đang quan tâm căn 3PN tầng 12 block B.',
      sentAt: '2026-08-09T09:05:00+07:00',
      status: 'read',
    },
    {
      id: 'm-003',
      conversationId: 'c-001',
      sender: 'them',
      content: 'Dạ anh, block B hiện còn 4 căn 3PN. Em gửi anh bảng giá chi tiết nha.',
      sentAt: '2026-08-09T09:10:00+07:00',
    },
    {
      id: 'm-004',
      conversationId: 'c-001',
      sender: 'them',
      content: 'Căn 12B diện tích 88m², hướng Đông Nam, view công viên. Giá 4.2 tỷ. Anh xem hôm nay được không ạ?',
      sentAt: '2026-08-09T09:20:00+07:00',
    },
    {
      id: 'm-005',
      conversationId: 'c-001',
      sender: 'them',
      content: 'Dạ anh, căn 12B còn 1 suất cuối. Anh xem chiều nay được không?',
      sentAt: '2026-08-09T09:25:00+07:00',
    },
  ],
  'c-002': [
    {
      id: 'm-101',
      conversationId: 'c-002',
      sender: 'them',
      content: 'Chào chị, em là Hương Trà - môi giới khu vực Quận 2 ạ.',
      sentAt: '2026-08-09T08:00:00+07:00',
    },
    {
      id: 'm-102',
      conversationId: 'c-002',
      sender: 'me',
      content: 'Chào Trà, chị muốn xem phân khu A.',
      sentAt: '2026-08-09T08:10:00+07:00',
      status: 'read',
    },
    {
      id: 'm-103',
      conversationId: 'c-002',
      sender: 'them',
      content: 'Mình vừa gửi bảng giá mới nhất của phân khu A. Chị check giúp nhé!',
      sentAt: '2026-08-09T09:12:00+07:00',
    },
  ],
  'c-003': [
    {
      id: 'm-201',
      conversationId: 'c-003',
      sender: 'them',
      content: 'Chào anh/chị, đây là thông báo chính thức từ Sun Group.',
      sentAt: '2026-08-09T08:00:00+07:00',
    },
    {
      id: 'm-202',
      conversationId: 'c-003',
      sender: 'them',
      content: 'Lễ mở bán Sun Riverside chính thức diễn ra 15/08 tại khách sạn Rex, Q1.',
      sentAt: '2026-08-09T08:25:00+07:00',
    },
    {
      id: 'm-203',
      conversationId: 'c-203',
      sender: 'them',
      content: 'Lễ mở bán Sun Riverside chính thức diễn ra 15/08. Anh chị quan tâm inbox nha.',
      sentAt: '2026-08-09T08:30:00+07:00',
    },
  ],
  'c-004': [
    {
      id: 'm-301',
      conversationId: 'c-004',
      sender: 'them',
      content: 'Anh ơi, bên em có chính sách ưu đãi đặc biệt cho khách hàng thân thiết.',
      sentAt: '2026-08-09T07:00:00+07:00',
    },
    {
      id: 'm-302',
      conversationId: 'c-004',
      sender: 'me',
      content: 'Cảm ơn anh, mình sẽ xem xét và phản hồi sớm ạ.',
      sentAt: '2026-08-09T07:30:00+07:00',
      status: 'read',
    },
  ],
  'c-005': [
    {
      id: 'm-401',
      conversationId: 'c-005',
      sender: 'me',
      content: 'Cho mình hỏi về thủ tục đặt cọc giữ chỗ căn hộ.',
      sentAt: '2026-08-08T16:00:00+07:00',
      status: 'read',
    },
    {
      id: 'm-402',
      conversationId: 'c-005',
      sender: 'them',
      content: 'Yêu cầu #2834 của anh đã được tiếp nhận. Chúng tôi sẽ phản hồi trong 24h.',
      sentAt: '2026-08-08T17:45:00+07:00',
    },
  ],
  'c-006': [
    {
      id: 'm-501',
      conversationId: 'c-006',
      sender: 'them',
      content: 'Cảm ơn em, anh sẽ liên hệ lại sau.',
      sentAt: '2026-08-08T14:20:00+07:00',
    },
  ],
  'c-007': [
    {
      id: 'm-601',
      conversationId: 'c-007',
      sender: 'them',
      content: 'Anh ơi, mình có phối cảnh 3D mới nhất của căn penthouse không?',
      sentAt: '2026-08-07T09:00:00+07:00',
    },
    {
      id: 'm-602',
      conversationId: 'c-007',
      sender: 'me',
      content: 'Dạ vâng, chị gửi thêm hình ảnh phối cảnh cho em xem với ạ.',
      sentAt: '2026-08-07T10:15:00+07:00',
      status: 'delivered',
    },
  ],
  'c-008': [
    {
      id: 'm-701',
      conversationId: 'c-008',
      sender: 'them',
      content: 'Chào anh/chị, mình có thể hỗ trợ gì cho mình ạ?',
      sentAt: '2026-08-06T09:00:00+07:00',
    },
  ],
};

// ============================================================================
// Helpers
// ============================================================================


const TIMEZONE = 'Asia/Ho_Chi_Minh';

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIMEZONE,
});

/** Doc thu trong tuan theo mui gio da ghim, khong theo mui gio may chay */
const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  timeZone: TIMEZONE,
});

const WEEKDAY_VI: Record<string, string> = {
  Sun: 'CN',
  Mon: 'T2',
  Tue: 'T3',
  Wed: 'T4',
  Thu: 'T5',
  Fri: 'T6',
  Sat: 'T7',
};

/** Gio (HH:mm) cho bubble */
export const formatMessageTime = (iso: string): string =>
  timeFormatter.format(new Date(iso));

/** Nhan cua vach ngan giua cac cum tin nhan: "21:35 T7" */
export const formatDividerLabel = (iso: string): string => {
  const date = new Date(iso);
  const weekday = WEEKDAY_VI[weekdayFormatter.format(date)] ?? '';
  return `${timeFormatter.format(date)} ${weekday}`.trim();
};


export type MessageRow =
  | { kind: 'divider'; id: string; label: string }
  | {
      kind: 'message';
      id: string;
      message: Message;
      /** Dau cum - chi dong nay moi bo goc tren */
      isFirstOfGroup: boolean;
      /** Cuoi cum - chi dong nay moi hien avatar va gio */
      isLastOfGroup: boolean;
    };

/** Cach nhau qua lau thi chen vach ngan thoi gian */
const DIVIDER_GAP_MS = 30 * 60 * 1000;

const GROUP_GAP_MS = 15 * 60 * 1000;


export const buildMessageRows = (messages: Message[]): MessageRow[] => {
  const rows: MessageRow[] = [];

  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    const next = messages[index + 1];

    const sentAt = new Date(message.sentAt).getTime();
    const gapBefore = previous ? sentAt - new Date(previous.sentAt).getTime() : Infinity;
    const gapAfter = next ? new Date(next.sentAt).getTime() - sentAt : Infinity;

    if (gapBefore >= DIVIDER_GAP_MS) {
      rows.push({
        kind: 'divider',
        id: `divider-${message.id}`,
        label: formatDividerLabel(message.sentAt),
      });
    }

    const startsGroup =
      !previous || previous.sender !== message.sender || gapBefore >= GROUP_GAP_MS;
    const endsGroup = !next || next.sender !== message.sender || gapAfter >= GROUP_GAP_MS;

    rows.push({
      kind: 'message',
      id: message.id,
      message,
      isFirstOfGroup: startsGroup,
      isLastOfGroup: endsGroup,
    });
  });

  return rows;
};

/**
 * Channel label - map sang nhan hien thi o list.
 */
export const CHANNEL_LABELS: Record<ConversationChannel, string> = {
  'moi-gioi': 'Môi giới',
  'chu-dau-tu': 'Chủ đầu tư',
  'ho-tro': 'Hỗ trợ',
  'khach-hang': 'Khách hàng',
  nhom: 'Nhóm',
};

/** Hoi thoai nhom nhan biet qua danh sach thanh vien, xem chu thich o model */
export const isGroupConversation = (conversation: Conversation): boolean =>
  (conversation.memberNames?.length ?? 0) > 0;

/**
 * Dung mot hoi thoai nhom moi tu ten nhom va cac hoi thoai duoc chon.
 *
 * Chi tao du lieu, khong dong vao state - noi goi tu quyet dinh chen vao dau
 * danh sach va co chon no ngay hay khong.
 */
export const createGroupConversation = (
  name: string,
  members: Conversation[],
): { conversation: Conversation; welcome: Message } => {
  const id = `group-${Date.now()}`;
  const now = new Date();
  const memberNames = members.map((member) => member.name);

  return {
    conversation: {
      id,
      name,
      channel: 'nhom',
      status: 'online',
      lastMessage: `Bạn đã tạo nhóm với ${memberNames.length} thành viên.`,
      lastMessageTime: 'Vừa xong',
      lastMessageAt: now.toISOString(),
      unreadCount: 0,
      isOwnLastMessage: true,
      memberNames,
    },
    welcome: {
      id: `m-${id}`,
      conversationId: id,
      sender: 'system',
      content: `Bạn đã tạo nhóm "${name}" cùng ${memberNames.join(', ')}.`,
      sentAt: now.toISOString(),
    },
  };
};


export const CHANNEL_TONE: Record<
  ConversationChannel,
  { bg: string; text: string }
> = {
  'moi-gioi': { bg: 'bg-brand-50', text: 'text-brand-700' },
  'chu-dau-tu': { bg: 'bg-accent-50', text: 'text-accent-600' },
  'ho-tro': { bg: 'bg-jade-50', text: 'text-jade-700' },
  'khach-hang': { bg: 'bg-gray-100', text: 'text-gray-700' },
  nhom: { bg: 'bg-brand-50', text: 'text-brand-700' },
};
