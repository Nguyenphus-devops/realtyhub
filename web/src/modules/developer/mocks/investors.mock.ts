/**
 * SINGLE SOURCE OF TRUTH cho 25 chu dau tu chinh thuc.
 *
 * Section "CAC CHU DAU TU" tren trang chu (Doitac.tsx) va trang /chu-dau-tu
 * (list + detail) deu dung mang nay. Khi backend co module `investors`, chi
 * can sua investor.service.ts - khong component nao phai doc file nay truc
 * tiep ngoai service.
 *
 * QUAN TRONG:
 *   - Khong duplicate o day (dung 25 entries duy nhat).
 *   - Logo URL absolute tu https://realtyhub.com.vn/assets/brand/logos/.
 *   - Slug duoc suy ra tu `name` bang toSlug() de khop route hien co.
 */

import type { Investor } from '../models/investor.model';

const BASE_LOGO_URL = 'https://realtyhub.com.vn/assets/brand/logos/';

/** Tao slug URL tu ten tieng Viet (chua dau) - xoa diacritics, viet thuong,
    gop cac ky tu khong phai chu-so thanh dau '-', trim dau '-'. Dung chung
    voi logic da co trong developers.mock.ts de cac slug luon khop nhau. */
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** 25 chu dau tu. Thu tu trong mang nay la thu tu hien thi (co dinh). */
const INVESTOR_NAMES: ReadonlyArray<{ name: string; logoFile: string }> = [
  { name: 'Azure', logoFile: 'azure.png' },
  { name: 'BIM Group', logoFile: 'bimgroup.webp' },
  { name: 'CapitaLand', logoFile: 'capitaland.png' },
  { name: 'Đất Xanh Group', logoFile: 'datxanhgroup.webp' },
  { name: 'Ecopark', logoFile: 'ecopark.webp' },
  { name: 'Gamuda Land', logoFile: 'gamudaland.png' },
  { name: 'Gladia', logoFile: 'gladia.png' },
  { name: 'Hoa Lâm', logoFile: 'hoalam.png' },
  { name: 'Hongkong Land', logoFile: 'hongkongland.png' },
  { name: 'HVH', logoFile: 'hvh.png' },
  { name: 'Keppel Land', logoFile: 'keppelland.png' },
  { name: 'Khang Điền', logoFile: 'khangdien.png' },
  { name: 'Mapletree', logoFile: 'mapletree.png' },
  { name: 'Masterise', logoFile: 'masterise.png' },
  { name: 'Meyland', logoFile: 'meyland.png' },
  { name: 'MIK Group', logoFile: 'mikgroup.webp' },
  { name: 'Nam Group', logoFile: 'namgroup.png' },
  { name: 'Nam Long', logoFile: 'namlong.webp' },
  { name: 'STC Golden Land', logoFile: 'stcgoldenland.png' },
  { name: 'Sun Group', logoFile: 'sungroup.png' },
  { name: 'Tây Hồ', logoFile: 'tayho.png' },
  { name: 'TBS Group', logoFile: 'tbsgroup.webp' },
  { name: 'The Grand Hồ Tràm', logoFile: 'thegrandhotram.png' },
  { name: 'Thuận Việt', logoFile: 'thuanviet.png' },
  { name: 'Vinhomes', logoFile: 'vinhomes.webp' },
];

/** 25 Investor records - data goc duy nhat, khong duplicate. */
export const INVESTORS: Investor[] = INVESTOR_NAMES.map(({ name, logoFile }) => ({
  name,
  logo: `${BASE_LOGO_URL}${logoFile}`,
  slug: toSlug(name),
}));

/** Lookup theo slug - dung cho /chu-dau-tu/[slug]. */
export const findInvestorBySlug = (slug: string): Investor | undefined =>
  INVESTORS.find((entry) => entry.slug === slug);

/** Lookup theo ten (case-insensitive, khong dau) - dung de match voi
    developerId tu project mock (vi cac mock project co developerId nhu
    "cdt-vingroup" nen ta match theo ten "Vingroup" qua bang mapping). */
export const findInvestorByName = (name: string): Investor | undefined => {
  const norm = toSlug(name);
  return INVESTORS.find((entry) => entry.slug === norm);
};
