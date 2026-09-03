'use client';

import { useMemo, useState } from 'react';

import { FiMessageSquare } from 'react-icons/fi';

import ChatPanel from './ChatPanel';
import ConversationList from './ConversationList';
import NewChatDialog, { type NewChatMode } from './NewChatDialog';
import {
  createGroupConversation,
  CONVERSATIONS,
  MESSAGES_BY_CONVERSATION,
  SUGGESTED_CONTACTS,
  type Conversation,
  type Message,
} from '../models/tin-nhan.model';


const InboxClient = () => {
  const [selectedId, setSelectedId] = useState<string | null>(CONVERSATIONS[0]?.id ?? null);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >(() => {
    // Clone mock data tranh mutate
    const cloned: Record<string, Message[]> = {};
    Object.entries(MESSAGES_BY_CONVERSATION).forEach(([key, list]) => {
      cloned[key] = [...list];
    });
    return cloned;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatMobile, setShowChatMobile] = useState(false);
  /** `null` = dong; con lai la che do hop thoai dang mo */
  const [dialogMode, setDialogMode] = useState<NewChatMode | null>(null);

  const selectedConversation = selectedId
    ? conversations.find((c) => c.id === selectedId) ?? null
    : null;

  const selectedMessages = selectedId
    ? messagesByConversation[selectedId] ?? []
    : [];

  // Khi user select tu list -> reset unread count + mobile chat visible
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowChatMobile(true);
    // Reset unread ngay khi chon (sync state thay vi effect)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  const handleBack = () => setShowChatMobile(false);

  
  const directory = useMemo(
    () => [
      ...conversations,
      ...SUGGESTED_CONTACTS.filter(
        (contact) => !conversations.some((item) => item.id === contact.id),
      ),
    ],
    [conversations],
  );

  
  const handleDialogSubmit = (people: Conversation[], groupName: string) => {
    if (dialogMode === 'group') {
      const { conversation, welcome } = createGroupConversation(groupName, people);

      setConversations((prev) => [conversation, ...prev]);
      setMessagesByConversation((prev) => ({ ...prev, [conversation.id]: [welcome] }));
      setSelectedId(conversation.id);
    } else {
      const person = people[0];
      if (!person) return;

      const isExisting = conversations.some((item) => item.id === person.id);
      if (!isExisting) {
        setConversations((prev) => [person, ...prev]);
        setMessagesByConversation((prev) => ({ ...prev, [person.id]: [] }));
      }
      setSelectedId(person.id);
    }

    setShowChatMobile(true);
    setDialogMode(null);
  };

  // Send message -> append vao conversation
  const handleSend = (content: string) => {
    if (!selectedId) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeLabel = `${hh}:${mm}`;

    setMessagesByConversation((prev) => {
      const list = prev[selectedId] ?? [];
      return {
        ...prev,
        [selectedId]: [
          ...list,
          {
            id: `m-${Date.now()}`,
            conversationId: selectedId,
            sender: 'me',
            content,
            sentAt: now.toISOString(),
            status: 'sent',
          },
        ],
      };
    });

    // Update lastMessage preview trong list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: content,
              lastMessageTime: timeLabel,
              lastMessageAt: now.toISOString(),
              isOwnLastMessage: true,
            }
          : c,
      ),
    );
  };

  return (
    
    <div className="fullscreen-page grid h-[calc(100dvh-8rem)] grid-cols-1 lg:h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,360px)_1fr]">
      <div
        className={`min-h-0 lg:border-r lg:border-gray-200 ${
          showChatMobile ? 'hidden lg:block' : 'block'
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelect}
          onNewMessage={() => setDialogMode('direct')}
          onCreateGroup={() => setDialogMode('group')}
        />
      </div>

      <div className={`min-h-0 ${showChatMobile ? 'block' : 'hidden lg:block'}`}>
        {selectedConversation ? (
          <ChatPanel
            conversation={selectedConversation}
            messages={selectedMessages}
            onSend={handleSend}
            onBack={handleBack}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {dialogMode && (
        <NewChatDialog
          mode={dialogMode}
          people={directory}
          onClose={() => setDialogMode(null)}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  );
};

// ============================================================================
// Empty state - khi chua chon conversation
// ============================================================================

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-500">
      <FiMessageSquare aria-hidden className="h-10 w-10" />
    </div>
    <h3 className="mt-5 text-xl font-bold text-gray-900">Chọn một hội thoại</h3>
    <p className="mt-2 max-w-xs text-theme-sm text-gray-600">
      Chọn cuộc trò chuyện bên trái để bắt đầu nhắn tin với môi giới, chủ đầu tư
      hoặc đội ngũ hỗ trợ.
    </p>
  </div>
);

export default InboxClient;
