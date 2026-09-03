'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import {
  FiChevronLeft,
  FiImage,
  FiInfo,
  FiMic,
  FiPhone,
  FiSend,
  FiSmile,
  FiThumbsUp,
  FiVideo,
} from 'react-icons/fi';

import PlaceholderThumb from '@/common/components/PlaceholderThumb';

import ConversationAvatar from './ConversationAvatar';
import {
  buildMessageRows,
  CHANNEL_LABELS,
  CHANNEL_TONE,
  formatMessageTime,
  isGroupConversation,
  type Conversation,
  type Message,
  type MessageRow,
} from '../models/tin-nhan.model';

type ChatPanelProps = {
  conversation: Conversation;
  messages: Message[];
  onSend: (content: string) => void;
  onBack: () => void;
};

const STATUS_LABEL: Record<Conversation['status'], string> = {
  online: 'Đang hoạt động',
  away: 'Vắng mặt',
  offline: 'Hoạt động 5 giờ trước',
};

const STATUS_DOT: Record<Conversation['status'], string> = {
  online: 'bg-jade-500',
  away: 'bg-accent-500',
  offline: 'bg-gray-400',
};

// ============================================================================
// Header
// ============================================================================

const HeaderAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-brand-500 transition hover:bg-brand-50"
  >
    {icon}
  </button>
);

const ConversationHeader = ({
  conversation,
  onBack,
}: Pick<ChatPanelProps, 'conversation' | 'onBack'>) => {
  const channel = CHANNEL_TONE[conversation.channel];
  const isGroup = isGroupConversation(conversation);

  // Nhom thi dong duoi liet ke thanh vien; chat doi mot thi bao trang thai
  const subtitle = isGroup
    ? `${(conversation.memberNames ?? []).length + 1} thành viên · ${(
        conversation.memberNames ?? []
      ).join(', ')}`
    : STATUS_LABEL[conversation.status];

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 px-3 py-2.5 md:px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Quay lại danh sách"
        className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-brand-500 transition hover:bg-gray-100 lg:hidden"
      >
        <FiChevronLeft aria-hidden />
      </button>

      <span className="relative shrink-0">
        <ConversationAvatar conversation={conversation} size={10} />
        {/* Nhom khong co trang thai online chung nen bo cham trang thai di */}
        {!isGroup && (
          <span
            aria-hidden
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              STATUS_DOT[conversation.status]
            }`}
          />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h2 className="truncate text-theme-sm font-bold text-gray-900">
            {conversation.name}
          </h2>
          <span
            className={`hidden shrink-0 rounded-full px-2 py-0.5 text-theme-xs font-semibold md:inline-flex ${channel.bg} ${channel.text}`}
          >
            {CHANNEL_LABELS[conversation.channel]}
          </span>
        </div>
        <p className="truncate text-theme-xs text-gray-500">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <HeaderAction icon={<FiPhone aria-hidden />} label="Gọi thoại" />
        <HeaderAction icon={<FiVideo aria-hidden />} label="Gọi video" />
        <HeaderAction icon={<FiInfo aria-hidden />} label="Thông tin hội thoại" />
      </div>
    </header>
  );
};

// ============================================================================
// Bubble
// ============================================================================


const bubbleRadius = (isMe: boolean, isFirst: boolean, isLast: boolean) => {
  const corners = [
    isFirst ? '' : isMe ? 'rounded-tr-md' : 'rounded-tl-md',
    isLast ? '' : isMe ? 'rounded-br-md' : 'rounded-bl-md',
  ].filter(Boolean);

  return ['rounded-2xl', ...corners].join(' ');
};

const MessageBubble = ({
  row,
  conversation,
}: {
  row: Extract<MessageRow, { kind: 'message' }>;
  conversation: Conversation;
}) => {
  const { message, isFirstOfGroup, isLastOfGroup } = row;

  // Thong bao he thong khong phai loi ai noi ra -> khong bong bong, nam giua
  if (message.sender === 'system') {
    return (
      <p className="px-6 py-3 text-center text-theme-xs leading-relaxed text-gray-500">
        {message.content}
      </p>
    );
  }

  const isMe = message.sender === 'me';

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar chi deo o dong cuoi cum; cac dong tren chua o trong cung be
          rong de ca cum thang hang. */}
      {!isMe &&
        (isLastOfGroup ? (
          <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
            <PlaceholderThumb
              seed={conversation.id}
              label={conversation.name.charAt(0)}
              className="h-full w-full"
            />
          </span>
        ) : (
          <span aria-hidden className="h-7 w-7 shrink-0" />
        ))}

      <div
        title={formatMessageTime(message.sentAt)}
        className={`max-w-[75%] px-3 py-2 text-theme-sm leading-relaxed md:max-w-[65%] ${bubbleRadius(
          isMe,
          isFirstOfGroup,
          isLastOfGroup,
        )} ${isMe ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        {message.content}
      </div>
    </div>
  );
};

// ============================================================================
// Chat input
// ============================================================================

/**
 * Tran chieu cao o nhap = 4 dong x 20px (leading-5) + 20px padding (py-2.5)
 * + 0px vien (o nhap khong co vien). Qua nguong nay textarea moi bat cuon.
 */
const MAX_INPUT_HEIGHT = 100;

const ComposerAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-brand-500 transition hover:bg-brand-50"
  >
    {icon}
  </button>
);

const ChatInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasDraft = draft.trim().length > 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const fit = () => {
      textarea.style.height = 'auto';

      // `scrollHeight` gom noi dung + padding nhung KHONG gom duong vien, con
      // `box-sizing: border-box` thi chieu cao lai da tinh ca vien. Doc vien tu
      // computed style de cong bu, khong thi o nhap hut vai px va cat dong chu.
      const style = getComputedStyle(textarea);
      const border =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

      const wanted = textarea.scrollHeight + border;
      textarea.style.height = `${Math.min(wanted, MAX_INPUT_HEIGHT)}px`;
      textarea.style.overflowY = wanted > MAX_INPUT_HEIGHT ? 'auto' : 'hidden';
    };

    fit();
    // Khung doi be ngang thi chu xuong dong khac di, phai do lai chieu cao
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [draft]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft('');
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-1 border-t border-gray-200 px-2 py-2 md:px-3"
    >
      {/* An bot nut phu tren man hinh hep de o nhap con du cho */}
      <span className="hidden items-center sm:flex">
        <ComposerAction icon={<FiMic aria-hidden />} label="Ghi âm" />
        <ComposerAction icon={<FiImage aria-hidden />} label="Gửi ảnh" />
      </span>

      <label htmlFor="chat-draft" className="sr-only">
        Nhập tin nhắn
      </label>
      <div className="relative flex-1">
        <textarea
          id="chat-draft"
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit(event);
            }
          }}
          placeholder="Aa"
          rows={1}
          // `leading-5` co dinh o moi co chu de chieu cao dong khong doi khi
          // qua breakpoint; `overflow-hidden` la trang thai truoc khi JS chay.
          className="w-full resize-none overflow-hidden rounded-3xl bg-gray-100 py-2.5 pl-4 pr-11 text-theme-sm leading-5 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
        />
        <button
          type="button"
          aria-label="Chèn biểu tượng cảm xúc"
          className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full text-lg text-brand-500 transition hover:bg-white"
        >
          <FiSmile aria-hidden />
        </button>
      </div>

      {/* Chua go gi thi la nut tha tim nhanh; go roi thi thanh nut gui - dung
          cach Messenger doi vai tro mot o nut duy nhat. */}
      {hasDraft ? (
        <button
          type="submit"
          aria-label="Gửi"
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-brand-500 transition hover:bg-brand-50"
        >
          <FiSend aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onSend('👍')}
          aria-label="Gửi biểu tượng thích"
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-brand-500 transition hover:bg-brand-50"
        >
          <FiThumbsUp aria-hidden />
        </button>
      )}
    </form>
  );
};

// ============================================================================
// ChatPanel
// ============================================================================

const ChatPanel = ({ conversation, messages, onSend, onBack }: ChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => buildMessageRows(messages), [messages]);

  const lastReadOwnId = useMemo(() => {
    const read = messages.filter((item) => item.sender === 'me' && item.status === 'read');
    return read.length > 0 ? read[read.length - 1].id : null;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <ConversationHeader conversation={conversation} onBack={onBack} />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-4">
        {/* Cuoc vua tao tu "Tin nhan moi" chua co dong nao - de trong thi nguoi
            dung tuong trang loi, nen noi ro la chua ai nhan gi. */}
        {rows.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <ConversationAvatar conversation={conversation} size={14} />
            <p className="mt-3 text-theme-sm font-bold text-gray-900">
              {conversation.name}
            </p>
            <p className="mt-1 text-theme-xs text-gray-500">
              Chưa có tin nhắn nào. Gửi lời chào để bắt đầu.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {rows.map((row) =>
            row.kind === 'divider' ? (
              <p
                key={row.id}
                className="py-4 text-center text-theme-xs font-medium text-gray-400"
              >
                {row.label}
              </p>
            ) : (
              <div key={row.id}>
                <MessageBubble row={row} conversation={conversation} />

                {/* Avatar ti hon duoi tin cuoi cung da duoc doc - dau hieu
                    "da xem" cua Messenger, thay cho dong chu "Da doc". */}
                {row.message.id === lastReadOwnId && (
                  <div className="mt-1 flex justify-end">
                    <span
                      title="Đã xem"
                      aria-label="Đã xem"
                      className="block h-4 w-4 overflow-hidden rounded-full ring-1 ring-white"
                    >
                      <PlaceholderThumb
                        seed={conversation.id}
                        label={conversation.name.charAt(0)}
                        className="h-full w-full"
                      />
                    </span>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      <ChatInput onSend={onSend} />
    </div>
  );
};

export default ChatPanel;
