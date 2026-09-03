import PlaceholderThumb from '@/common/components/PlaceholderThumb';

import { isGroupConversation, type Conversation } from '../models/tin-nhan.model';

type ConversationAvatarProps = {
  conversation: Conversation;
  /** Be ngang o avatar, don vi Tailwind (14 = 3.5rem) */
  size?: 10 | 14;
  className?: string;
};

/** Khoang so do da viet san - Tailwind khong doc duoc ten class ghep dong */
const SIZE_CLASSES: Record<NonNullable<ConversationAvatarProps['size']>, string> = {
  10: 'h-10 w-10',
  14: 'h-14 w-14',
};

const GROUP_PART_CLASSES: Record<
  NonNullable<ConversationAvatarProps['size']>,
  { part: string; offset: string }
> = {
  10: { part: 'h-7 w-7', offset: 'ring-2' },
  14: { part: 'h-9 w-9', offset: 'ring-2' },
};


const ConversationAvatar = ({
  conversation,
  size = 14,
  className = '',
}: ConversationAvatarProps) => {
  const box = `${SIZE_CLASSES[size]} ${className}`;

  if (!isGroupConversation(conversation)) {
    return (
      <span className={`block overflow-hidden rounded-full ${box}`}>
        <PlaceholderThumb
          seed={conversation.id}
          label={conversation.name.charAt(0)}
          className="h-full w-full"
        />
      </span>
    );
  }

  const members = conversation.memberNames ?? [];
  const { part, offset } = GROUP_PART_CLASSES[size];

  return (
    <span className={`relative block ${box}`}>
      {members.slice(0, 2).map((member, index) => (
        <span
          key={member}
          className={`absolute overflow-hidden rounded-full ring-white ${part} ${offset} ${
            index === 0 ? 'left-0 top-0' : 'bottom-0 right-0'
          }`}
        >
          <PlaceholderThumb
            seed={`${conversation.id}-${member}`}
            label={member.charAt(0)}
            className="h-full w-full"
          />
        </span>
      ))}
    </span>
  );
};

export default ConversationAvatar;
