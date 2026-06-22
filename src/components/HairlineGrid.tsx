export function HairlineGrid({ light = false }: { light?: boolean }) {
  const color = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  return (
    <div className="hidden md:block pointer-events-none absolute inset-0 z-10" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${(i * 100) / 4}%`, background: color }}
        />
      ))}
    </div>
  );
}
