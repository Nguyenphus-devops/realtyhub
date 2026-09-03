const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-5 text-theme-sm font-bold uppercase tracking-wide text-navy-800">
    {children}
    <span aria-hidden className="mt-2 block h-0.5 w-9 rounded-full bg-brand-500" />
  </h2>
);

export default FooterHeading;
