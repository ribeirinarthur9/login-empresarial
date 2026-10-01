import { useEffect, useRef, useState } from "react";

/** Decorative drawn cursor. The real cursor is never hidden or controlled. */
export function FakeCursor({ chaos }: { chaos: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      const lag = chaos >= 2 ? 0.08 : 0.25;
      const dx = tx - x, dy = ty - y;
      x += dx * lag; y += dy * lag;
      const speed = Math.min(Math.hypot(dx, dy) / 40, chaos >= 2 ? 3 : 0.4);
      const angle = Math.atan2(dy, dx);
      if (ref.current) {
        ref.current.style.transform = `translate(${x + 18}px, ${y + 18}px) rotate(${angle}rad) scaleX(${1 + speed}) rotate(${-angle}rad)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [chaos]);

  useEffect(() => {
    if (chaos < 4) return;
    const id = setInterval(() => { setBroken(true); setTimeout(() => setBroken(false), 1200); }, 5000);
    return () => clearInterval(id);
  }, [chaos]);

  if (chaos < 1) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 origin-top-left">
      <svg width="26" height="30" viewBox="0 0 26 30" className={broken ? "animate-shake" : ""}>
        <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L21 17 Z" fill="var(--gold)" stroke="var(--navy)" strokeWidth="2" strokeLinejoin="round" />
        {broken && <path d="M5 6 L10 12 L7 15 L13 19" fill="none" stroke="var(--destructive)" strokeWidth="2" />}
      </svg>
      {broken && <span className="absolute left-6 top-0 whitespace-nowrap rounded bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">cursor quebrou!</span>}
    </div>
  );
}
