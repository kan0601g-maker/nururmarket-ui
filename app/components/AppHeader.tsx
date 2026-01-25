type NavLink = { href: string; label: string };

export default function AppHeader({
  leftTitle,
  rightLink,
  navLinks,
}: {
  leftTitle: string;
  rightLink?: { href: string; label: string };
  navLinks?: NavLink[];
}) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="text-sm font-semibold tracking-tight">{leftTitle}</div>

        {navLinks && navLinks.length > 0 ? (
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-zinc-700 hover:text-zinc-900 hover:underline"
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : rightLink ? (
          <a
            href={rightLink.href}
            className="text-sm text-zinc-700 hover:text-zinc-900 hover:underline"
          >
            {rightLink.label}
          </a>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
