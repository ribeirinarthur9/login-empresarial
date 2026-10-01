import { useState } from "react";

const COLORS = ["var(--gold)", "var(--primary)", "var(--destructive)", "var(--navy)", "var(--accent)"];

export function Particles({ x, y }: { x: number; y: number }) {
  const [parts] = useState(() =>
    Array.from({ length: 22 }, () => ({
      dx: (Math.random() - 0.5) * 260,
      dy: (Math.random() - 0.5) * 220,
      rot: Math.random() * 720,
      size: 5 + Math.random() * 9,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })),
  );
  return (
    <div aria-hidden className="pointer-events-none absolute" style={{ left: x, top: y }}>
      {parts.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-[2px]"
          style={{
            width: p.size, height: p.size * 0.6, background: p.color,
            animation: "particle 900ms ease-out forwards",
            ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px`, ["--rot" as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
