/**
 * Xu ly chuoi tieng Viet.
 *
 * Dai U+0300-U+036F la cac dau thanh/dau mu o dang to hop (combining marks).
 * Viet bang ma escape chu khong go thang ky tu dau vao source: ky tu to hop
 * dung mot minh rat de bi editor hoac cong cu chuan hoa lam hong.
 */
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/** "Hạ Long" -> "ha long". Dung de tim kiem khong dau. */
export const removeDiacritics = (value: string) =>
  value
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    // "đ" la chu cai rieng, NFD khong tach duoc nen phai thay tay
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

/** "Vọng Nguyệt" -> "vong-nguyet". Dung lam slug tren URL. */
export const toSlug = (value: string) =>
  removeDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * "Vĩnh Phúc" -> "vinh phuc". Dang chuan de so khop tu khoa: nguoi dung go
 * tim kiem thuong bo dau ("vinh phuc", "can ho") nen phai chuan hoa ca hai ve.
 */
export const normalizeVi = (value: string) => removeDiacritics(value).toLowerCase().trim();

/** Co chua tu khoa khong - bo qua dau va hoa thuong */
export const matchesVi = (haystack: string, needle: string) =>
  normalizeVi(haystack).includes(normalizeVi(needle));
