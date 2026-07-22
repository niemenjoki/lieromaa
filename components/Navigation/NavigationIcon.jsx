const ICON_PATHS = {
  home: (
    <>
      <path d="M3.5 10.2 12 3l8.5 7.2" />
      <path d="M6.2 9.2v10h11.6v-10M10 19.2v-5.4h4v5.4" />
    </>
  ),
  guides: (
    <>
      <path d="M4 5.2c3.2-.8 5.8-.2 8 1.5v13c-2.2-1.7-4.8-2.3-8-1.5z" />
      <path d="M20 5.2c-3.2-.8-5.8-.2-8 1.5v13c2.2-1.7 4.8-2.3 8-1.5z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.2c3.2-.8 5.8-.2 8 1.5v13c-2.2-1.7-4.8-2.3-8-1.5z" />
      <path d="M20 5.2c-3.2-.8-5.8-.2-8 1.5v13c2.2-1.7 4.8-2.3 8-1.5z" />
    </>
  ),
  blog: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.8" width="14" height="18.4" rx="2" />
      <path d="M8 6.5h8v3H8zM8.2 13h.1M12 13h.1M15.8 13h.1M8.2 17h.1M12 17h.1M15.8 17h.1" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.2 20c.8-4 3.1-6 6.8-6s6 2 6.8 6" />
      <path d="M8.7 4.2c1.8-1.4 4.8-1.4 6.6 0" />
    </>
  ),
  search: (
    <>
      <circle cx="10.7" cy="10.7" r="6.2" />
      <path d="m15.2 15.2 4.6 4.6" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="m5 5 14 14M19 5 5 19" />,
  worms: (
    <path d="M3.2 15.5c2.5-7.3 7.2-7.7 9.2-2.2 1.8 5 5.7 4.3 8.4-2.7M19.4 9.8l1.4.8-1.6.3" />
  ),
  worm: (
    <path d="M3.2 15.5c2.5-7.3 7.2-7.7 9.2-2.2 1.8 5 5.7 4.3 8.4-2.7M19.4 9.8l1.4.8-1.6.3" />
  ),
  products: (
    <>
      <path d="m12 3 8 4.3v9.4L12 21l-8-4.3V7.3z" />
      <path d="m4.4 7.5 7.6 4.2 7.6-4.2M12 11.7V21" />
    </>
  ),
};

export default function NavigationIcon({ name, className }) {
  const content = ICON_PATHS[name] ?? ICON_PATHS.products;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content}
    </svg>
  );
}
