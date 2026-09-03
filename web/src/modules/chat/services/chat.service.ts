/**
 * Lop truy xuat du lieu khung chat.
 *
 * HIEN TAI: hoi thoai mau trong bo nho, so khop tu khoa ngay tai client.
 * KHI CO BOT THAT: giu nguyen chu ky ham, thay than ham bang goi API.
 *
 * Khong component hay hook nao duoc doc mock truc tiep - moi thu di qua day.
 */
import { normalizeVi } from '@/common/utils/text';
import {
  MOCK_FALLBACK,
  MOCK_HISTORY,
  MOCK_QUICK_REPLIES,
  MOCK_REPLIES,
} from '../mocks/chat.mock';
import type { ChatMessage, QuickReply } from '../models/chat.model';

/** Do tre nap lich su - ngan, vi khung chat da mo ra roi */
const HISTORY_DELAY_MS = 200;

/**
 * Do tre bot "suy nghi". Dai hon that mot chut va co dao dong, vi tra loi tuc
 * thi trong ro la kich ban dung san.
 */
const TYPING_MIN_MS = 700;
const TYPING_MAX_MS = 1400;

const delay = <T>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Tim cau tra loi khop tu khoa dau tien, khong khop thi tra cau mac dinh */
const replyTo = (text: string): string => {
  const normalized = normalizeVi(text);

  const matched = MOCK_REPLIES.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword)),
  );

  return matched?.reply ?? MOCK_FALLBACK;
};

export const ChatService = {
  /** KHI CO BOT THAT: GET /chat/history */
  history: async (): Promise<ChatMessage[]> => delay(MOCK_HISTORY, HISTORY_DELAY_MS),

  quickReplies: async (): Promise<QuickReply[]> =>
    delay(MOCK_QUICK_REPLIES, HISTORY_DELAY_MS),

  /**
   * Gui mot cau va nhan cau tra loi cua bot.
   *
   * KHI CO BOT THAT: POST /chat/messages - luc do do tre gia lap bo di, thoi
   * gian cho chinh la thoi gian mang.
   */
  send: async (text: string): Promise<ChatMessage> => {
    const thinkingMs =
      TYPING_MIN_MS + Math.random() * (TYPING_MAX_MS - TYPING_MIN_MS);

    return delay(
      {
        publicId: `msg-bot-${Date.now()}`,
        role: 'bot' as const,
        text: replyTo(text),
        sentAt: new Date().toISOString(),
      },
      thinkingMs,
    );
  },
};
