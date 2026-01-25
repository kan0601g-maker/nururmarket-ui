type HeaderProps = {
  leftTitle: string;
  rightLink?: {
    href: string;
    label: string;
  };
};

export default function AppHeader({ leftTitle, rightLink }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="text-sm font-semibold tracking-tight">
          {leftTitle}
        </div>

        {rightLink ? (
          <a
            href={rightLink.href}
            className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
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
