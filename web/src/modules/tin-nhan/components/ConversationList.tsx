'use client';

import { useMemo, useState } from 'react';

import { FiEdit, FiMoreHorizontal, FiSearch, FiUsers } from 'react-icons/fi';

import ConversationAvatar from './ConversationAvatar';
import {
  CHANNEL_LABELS,
  type Conversation,
  type ConversationChannel,
} from '../models/tin-nhan.model';

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (id: string) => void;
  onNewMessage: () => void;
  onCreateGroup: () => void;
};


type FilterKey = 'all' | 'unread' | ConversationChannel;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'nhom', label: CHANNEL_LABELS.nhom },
  { key: 'moi-gioi', label: CHANNEL_LABELS['moi-gioi'] },
  { key: 'chu-dau-tu', label: CHANNEL_LABELS['chu-dau-tu'] },
  { key: 'ho-tro', label: CHANNEL_LABELS['ho-tro'] },
];

const STATUS_DOT: Record<Conversation['status'], string> = {
  online: 'bg-jade-500',
  away: 'bg-accent-500',
  offline: 'bg-gray-300',
};

const ConversationRow = ({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isUnread = conversation.unreadCount > 0;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isSelected ? 'true' : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
          isSelected ? 'bg-brand-50' : 'hover:bg-gray-100'
        }`}
      >
        <span className="relative shrink-0">
          <ConversationAvatar conversation={conversation} size={14} />
          {conversation.status !== 'offline' && (
            <span
              aria-hidden
              className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                STATUS_DOT[conversation.status]
              }`}
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`truncate text-theme-sm ${
                isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'
              }`}
            >
              {conversation.name}
            </span>
            {conversation.isVerified && (
              <span
                aria-label="Đã xác minh"
                className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-2 w-2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
          </span>

          {/* Noi dung va thoi gian tren cung mot dong nhu Messenger: dau cham
              giua hai phan, phan thoi gian khong bi cat vi da shrink-0. */}
          <span className="mt-0.5 flex items-center gap-1 text-theme-xs">
            <span
              className={`truncate ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
            >
              {conversation.isOwnLastMessage && 'Bạn: '}
              {conversation.lastMessage}
            </span>
            <span aria-hidden className="shrink-0 text-gray-400">
              ·
            </span>
            <span className="shrink-0 text-gray-400">{conversation.lastMessageTime}</span>
          </span>
        </span>

        {isUnread && (
          <span
            aria-label={`${conversation.unreadCount} tin nhắn chưa đọc`}
            className="h-3 w-3 shrink-0 rounded-full bg-brand-500"
          />
        )}
      </button>
    </li>
  );
};

const ConversationList = ({
  conversations,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onNewMessage,
  onCreateGroup,
}: ConversationListProps) => {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      if (filter === 'unread' && conversation.unreadCount === 0) return false;
      if (filter !== 'all' && filter !== 'unread' && conversation.channel !== filter) {
        return false;
      }
      if (!keyword) return true;
      return (
        conversation.name.toLowerCase().includes(keyword) ||
        conversation.lastMessage.toLowerCase().includes(keyword)
      );
    });
  }, [conversations, filter, searchQuery]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Đoạn chat</h1>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Tuỳ chọn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
            >
              <FiMoreHorizontal aria-hidden />
            </button>
            <button
              type="button"
              onClick={onCreateGroup}
              aria-label="Tạo nhóm chat"
              title="Tạo nhóm chat"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
            >
              <FiUsers aria-hidden />
            </button>
            {/* Nut but chi la hanh dong chinh nen to mau thuong hieu, hai nut
                kia chi la nen xam - de mat biet ngay dau la viec hay lam nhat. */}
            <button
              type="button"
              onClick={onNewMessage}
              aria-label="Tin nhắn mới"
              title="Tin nhắn mới"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600"
            >
              <FiEdit aria-hidden />
            </button>
          </span>
        </div>

        <label className="relative block">
          <span className="sr-only">Tìm kiếm hội thoại</span>
          <FiSearch
            aria-hidden
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm trên RealtyHub"
            className="w-full rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-theme-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25"
          />
        </label>

        {/* Cuon ngang khi het cho thay vi xuong dong - giu dau danh sach mot hang */}
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={filter === item.key}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-theme-sm font-semibold transition ${
                  filter === item.key
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-1">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-theme-sm text-gray-500">
            Không có hội thoại nào khớp.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedId}
                onSelect={() => onSelect(conversation.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
