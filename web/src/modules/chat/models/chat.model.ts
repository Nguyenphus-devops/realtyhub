/**
 * HOP DONG cua khung chat tro ly ao.
 *
 * Khi noi backend that (hoac mot dich vu chat ben thu ba), chi than ham trong
 * services/chat.service.ts phai doi - cac kieu duoi day giu nguyen.
 */

export type ChatRole = 'bot' | 'user';

export type ChatMessage = {
  publicId: string;
  role: ChatRole;
  text: string;
  /** ISO. Tin nhan mau dung moc co dinh de server va client khong lech gio. */
  sentAt: string;
};

/** Nut goi y bam nhanh, hien duoi khung tin nhan */
export type QuickReply = {
  publicId: string;
  label: string;
};

/** Anh dai dien bot, nam trong public/images/ */
export const CHATBOT_IMAGE = '/images/icon_chatbot_ai.png';

export const BOT_NAME = 'Trợ lý RealtyHub';
export const BOT_STATUS = 'Luôn trực tuyến';
