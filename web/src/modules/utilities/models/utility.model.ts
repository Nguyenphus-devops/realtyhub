/**
 * Model cho trang /tien-ich (Bộ tiện ích môi giới / khách hàng).
 *
 * Moi block = 1 chu de lon (vd "Tu van & Giao dich"). Moi block chua nhieu
 * nut tinh nang con (vd "Tinh khoan vay", "So sanh can", ...). Click vao
 * 1 nut -> mo modal "Sap ra mat" (ComingSoonModal).
 *
 * Khi co backend: lay qua GET /utilities -> tra ve mang nay.
 */

import type { ComponentType } from 'react';

export type UtilityTone =
  /** Blue - Tu van & Giao dich */
  | 'blue'
  /** Green - Phong thuy */
  | 'green'
  /** Purple - Thiet ke / Noi that */
  | 'purple'
  /** Orange - Dao tao */
  | 'orange'
  /** Teal - Quan ly & Hieu suat */
  | 'teal'
  /** Cyan - Phap ly & Quy hoach */
  | 'cyan'
  /** Gold - Tien ich khac */
  | 'gold';

/** Mot nut tinh nang ben trong 1 block */
export type UtilityAction = {
  publicId: string;
  /** Ten hien thi (VD: "Tinh khoan vay") */
  label: string;
  /** Mo ta 1 dong tooltip / modal */
  description: string;
  /** Flat icon React Icon component (FI/Hi family) */
  icon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  /** Tu khoa phu de search filter de chinh xac hon (VD: "loan", "mortgage") */
  keywords?: string[];
};

/** Mot khoi chu de lon */
export type UtilitySection = {
  publicId: string;
  /** Ten khoi (VD: "Tu van & Giao dich") */
  title: string;
  /** Mo ta ngan 1 dong */
  subtitle: string;
  /** Tone mau (dung cho icon, title bar, hover) */
  tone: UtilityTone;
  /** Icon dai dien cho ca khoi */
  sectionIcon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  /** Danh sach nut tinh nang trong khoi */
  actions: UtilityAction[];
};