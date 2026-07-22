/**
 * 아이콘 자리 표시자 — 팀 아이콘이 정해지면 이 컴포넌트 하나만 교체한다.
 * 모든 아이콘 자리는 반드시 이 컴포넌트를 쓸 것 (개별 아이콘 금지).
 */
export function IconPlaceholder({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-[27%] border-[1.5px] border-dashed border-current opacity-60 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
