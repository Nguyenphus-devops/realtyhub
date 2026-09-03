'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { FiCheck, FiSearch, FiX } from 'react-icons/fi';

import ConversationAvatar from './ConversationAvatar';
import { isGroupConversation, type Conversation } from '../models/tin-nhan.model';

/**
 * `direct` = tin nhan moi (chon dung mot nguoi, bam phat mo luon).
 * `group`  = tao nhom (nhap ten, tich nhieu nguoi, bam nut moi tao).
 */
export type NewChatMode = 'direct' | 'group';

type NewChatDialogProps = {
  mode: NewChatMode;
  /** Danh ba: ca nguoi da tro chuyen lan nguoi chua */
  people: Conversation[];
  onClose: () => void;
  /** `direct` tra ve dung mot phan tu; `group` tra ve tu MIN_MEMBERS tro len */
  onSubmit: (people: Conversation[], groupName: string) => void;
};

/** Nhom can it nhat 2 nguoi khac, duoi nguong do thi van la chat doi mot */
const MIN_MEMBERS = 2;

const TEXTS: Record<NewChatMode, { title: string; hint: string; action: string }> = {
  direct: {
    title: 'Tin nhắn mới',
    hint: 'Chọn một người để bắt đầu trò chuyện.',
    action: 'Nhắn tin',
  },
  group: {
    title: 'Tạo nhóm chat',
    hint: 'Đặt tên nhóm rồi chọn thành viên.',
    action: 'Tạo nhóm',
  },
};

const NewChatDialog = ({ mode, people, onClose, onSubmit }: NewChatDialogProps) => {
  const [groupName, setGroupName] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isGroupMode = mode === 'group';
  const texts = TEXTS[mode];

  // Khong cho long mot nhom vao trong nhom khac, cung khong nhan tin cho nhom
  // qua duong nay - nhom da co san trong danh sach ben trai.
  const candidates = useMemo(
    () => people.filter((item) => !isGroupConversation(item)),
    [people],
  );

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return candidates;
    return candidates.filter((item) => item.name.toLowerCase().includes(query));
  }, [candidates, keyword]);

  const selected = useMemo(
    () => candidates.filter((item) => selectedIds.includes(item.id)),
    [candidates, selectedIds],
  );

  const canSubmit = isGroupMode
    ? groupName.trim().length > 0 && selected.length >= MIN_MEMBERS
    : selected.length === 1;

  useEffect(() => {
    firstFieldRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const pick = (person: Conversation) => {
    // Che do tin nhan moi: bam mot cai la mo luon, khong bat bam them nut nao
    if (!isGroupMode) {
      onSubmit([person], '');
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(person.id)
        ? prev.filter((item) => item !== person.id)
        : [...prev, person.id],
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(selected, groupName.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-chat-title"
    >
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-gray-900/50"
      />

      <form
        onSubmit={submit}
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-card-hover"
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 id="new-chat-title" className="text-lg font-bold text-gray-900">
              {texts.title}
            </h2>
            <p className="mt-0.5 text-theme-xs text-gray-500">{texts.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100"
          >
            <FiX aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {isGroupMode && (
            <div>
              <label
                htmlFor="group-name"
                className="mb-1.5 block text-theme-sm font-semibold text-gray-800"
              >
                Tên nhóm
              </label>
              <input
                id="group-name"
                ref={firstFieldRef}
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Ví dụ: Khách hàng Vinhomes Grand Park"
                maxLength={60}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-theme-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          )}

          <div>
            <label htmlFor="people-search" className="sr-only">
              Tìm người
            </label>
            <div className="relative">
              <FiSearch
                aria-hidden
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                id="people-search"
                // Che do tin nhan moi khong co o ten nhom nen o tim la o dau tien
                ref={isGroupMode ? undefined : firstFieldRef}
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm theo tên..."
                className="w-full rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-theme-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25"
              />
            </div>
          </div>
        </div>

        {/* Vung duy nhat duoc cuon trong hop thoai */}
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {visible.length === 0 ? (
            <li className="px-4 py-8 text-center text-theme-sm text-gray-500">
              Không tìm thấy ai khớp.
            </li>
          ) : (
            visible.map((person) => {
              const isSelected = selectedIds.includes(person.id);

              return (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => pick(person)}
                    aria-pressed={isGroupMode ? isSelected : undefined}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-gray-100"
                  >
                    <ConversationAvatar conversation={person} size={10} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-theme-sm font-semibold text-gray-900">
                        {person.name}
                      </span>
                      <span className="block truncate text-theme-xs text-gray-500">
                        {person.lastMessage || 'Bắt đầu trò chuyện'}
                      </span>
                    </span>

                    {isGroupMode && (
                      <span
                        aria-hidden
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <FiCheck />}
                      </span>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Che do tin nhan moi bam mot cai la xong nen khong can chan nut */}
        {isGroupMode && (
          <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
            <p className="text-theme-xs text-gray-500">
              Đã chọn {selected.length} người
              {selected.length < MIN_MEMBERS && ` · cần ít nhất ${MIN_MEMBERS}`}
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {texts.action}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewChatDialog;
