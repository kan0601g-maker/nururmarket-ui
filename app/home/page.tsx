type RightLink = { href: string; label: string };

export default function AppHeader({
  leftTitle,
  rightLink,
}: {
  leftTitle: string;
  rightLink?: RightLink; // ← optionalにする
}) {
  return (
    <header className="...">
      <div className="...">{leftTitle}</div>

      {/* 右上リンクは渡された時だけ表示 */}
      {rightLink ? (
        <Link href={rightLink.href} className="...">
          {rightLink.label}
        </Link>
      ) : (
        <div />
      )}
    </header>
  );
}
