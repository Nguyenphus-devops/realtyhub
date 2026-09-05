'use client';

import { useEffect, useState, type ReactNode } from 'react';

import QrCheckinModal from '@/modules/events/components/QrCheckinModal';
import type { EventItem } from '@/modules/events/models/event.model';

/**
 * Client wrapper cho trang chi tiet - chi mount cac state client can thiet:
 *   - QrCheckinModal (modal QR check-in)
 *
 * Nhan event da serialize tu server component. EventDetailClient va
 * RegisterAndCheckin (component con) giao tiep qua custom event
 * "open-event-qr" -> tranh prop drilling qua nhieu cap.
 *
 * Custom event kiem tra slug de tranh mo sai modal khi nhieu trang detail
 * duoc mount cung luc (vi du SSR navigation).
 */
type Serialized = Pick<EventItem, 'publicId' | 'slug' | 'title' | 'startAt' | 'endAt' | 'checkinQr'>;

type Props = {
  event: Serialized;
  children: ReactNode;
};

const OPEN_QR_EVENT = 'open-event-qr';

const EventDetailClient = ({ event, children }: Props) => {
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ slug: string }>;
      if (custom.detail?.slug === event.slug) {
        setQrOpen(true);
      }
    };
    document.addEventListener(OPEN_QR_EVENT, handler);
    return () => {
      document.removeEventListener(OPEN_QR_EVENT, handler);
    };
  }, [event.slug]);

  return (
    <>
      {children}
      <QrCheckinModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        event={event as EventItem}
      />
    </>
  );
};

export default EventDetailClient;
