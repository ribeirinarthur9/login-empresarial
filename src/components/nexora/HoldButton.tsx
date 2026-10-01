import { useEffect, useRef, useState } from "react";

/** Final challenge: hold for 5 seconds while it trembles. Releasing resets. */
export function HoldButton({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  const [holding, setHolding] = useState(false);
  const raf = useRef(0);
  const start = useRef(0);

  useEffect(() => {
    if (!holding) { setP(0); return; }
    start.current = performance.now();
    const tick = (t: number) => {
      const v = Math.min((t - start.current) / 5000, 1);
      setP(v);
      if (v >= 1) { onDone(); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [holding, onDone]);

  return (
    <button
      type="button"
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
      className={`relative w-full overflow-hidden rounded-md bg-navy py-4 font-semibold text-navy-foreground select-none ${holding ? "animate-shake" : ""}`}
    >
      <span className="absolute inset-y-0 left-0 bg-gold/70" style={{ width: `${p * 100}%` }} />
      <span className="relative">{holding ? `Segurando... ${Math.ceil(5 - p * 5)}s (não solte!)` : "Segure por 5s para entrar de verdade"}</span>
    </button>
  );
}
