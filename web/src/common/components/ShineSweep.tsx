/**
 * Vet sang quet ngang qua phan tu, chay khi re chuot vao phan tu cha.
 *
 * Cha bat buoc phai co ba thu: class `group` (de bat hover), `relative` (de moc
 * toa do) va `overflow-hidden` (de vet sang khong tran ra ngoai vien bo tron).
 *
 * Ca be rong vet lan quang duong quet deu tinh theo % be rong cua chinh no, nen
 * gan vao nut ngan hay nhan dai gi cung quet tron mot luot.
 */
const ShineSweep = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/45 blur-xs transition-transform duration-900 ease-out group-hover:translate-x-[400%]"
  />
);

export default ShineSweep;
