// app/components/AppHeader.tsx
"use client";

import Link from "next/link";

type RightLink = { href: string; label: string };

export default function AppHeader({
  leftTitle,
  rightLink,
}: {
  leftTitle: string;
  rightLink?: RightLink;
}) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black text-white">
      <div className="text-sm font-semibold">{leftTitle}</div>

      {rightLink ? (
        <Link
          href={rightLink.href}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition"
        >
          {rightLink.label}
        </Link>
      ) : (
        <div />
      )}
    </header>
  );
}
