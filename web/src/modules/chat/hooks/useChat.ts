'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatService } from '../services/chat.service';
import type { ChatMessage, QuickReply } from '../models/chat.model';

/**
 * Trang thai mot cuoc hoi thoai.
 *
 * Khong dung TanStack Query nhu cac module khac: day khong phai du lieu may chu
 * duoc cache va lam moi, ma la mot so ghi chep chi noi them vao cuoi. Tuy vay
 * moi loi goi van di qua ChatService, dung quy uoc cua repo.
 *
 * Hook nam o ChatWidget (luon duoc gan) chu khong nam trong khung chat, nen dong
 * roi mo lai van con nguyen hoi thoai.
 *
 * @param isOpen khung chat dang mo hay khong - lich su chi nap o lan mo dau tien
 */
export const useChat = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasLoaded = useRef(false);
  // Bo dem rieng thay vi Date.now(): hai tin nhan gui sat nhau co the trung moc
  // thoi gian, va key trung nhau se lam React ve lai sai o.
  const counter = useRef(0);

  const nextId = () => {
    counter.current += 1;
    return `msg-local-${counter.current}`;
  };

  useEffect(() => {
    if (!isOpen || hasLoaded.current) return;
    hasLoaded.current = true;

    let cancelled = false;
    setIsLoading(true);

    void (async () => {
      const [history, replies] = await Promise.all([
        ChatService.history(),
        ChatService.quickReplies(),
      ]);

      if (cancelled) return;
      setMessages(history);
      setQuickReplies(replies);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((current) => [
        ...current,
        {
          publicId: nextId(),
          role: 'user',
          text: trimmed,
          sentAt: new Date().toISOString(),
        },
      ]);

      setIsTyping(true);
      const reply = await ChatService.send(trimmed);
      setIsTyping(false);

      setMessages((current) => [...current, { ...reply, publicId: nextId() }]);
    },
    [],
  );

  return { messages, quickReplies, isTyping, isLoading, send };
};
