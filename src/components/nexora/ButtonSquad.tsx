import { useEffect, useRef, useState } from "react";
import { Particles } from "./Particles";

type Pos = { x: number; y: number };
const W = 300, H = 170;
const HOME = { enter: { x: 90, y: 60 }, cancel: { x: 0, y: 125 }, forgot: { x: 180, y: 125 } };

/**
 * The "Entrar" button flees; "Cancelar" and "Esqueci a senha" team up to cover it.
 * Chaos 3+: buttons can shatter into particles and respawn.
 */
export function ButtonSquad({ chaos, onAttempt, calm }: { chaos: number; onAttempt: () => void; calm: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState<Pos>(HOME.enter);
  const [cancel, setCancel] = useState<Pos>(HOME.cancel);
  const [forgot, setForgot] = useState<Pos>(HOME.forgot);
  const [boom, setBoom] = useState<{ id: number; x: number; y: number } | null>(null);
  const [gone, setGone] = useState(false);
  const [arrow, setArrow] = useState(0);
  const enterRef = useRef(enter);
  enterRef.current = enter;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const c = { x: enterRef.current.x + 60, y: enterRef.current.y + 20 };
      const d = Math.hypot(mx - c.x, my - c.y);
      setArrow(Math.atan2(c.y - my, c.x - mx) + Math.PI + (chaos >= 3 ? 1.3 : 0));
      const radius = 50 + chaos * 25;
      if (d > radius) {
        if (chaos >= 2) { setCancel(HOME.cancel); setForgot(HOME.forgot); }
        return;
      }
      const power = calm ? 30 : 40 + chaos * 30;
      const ang = Math.atan2(c.y - my, c.x - mx);
      let nx = enterRef.current.x + Math.cos(ang) * power;
      let ny = enterRef.current.y + Math.sin(ang) * power;
      if (nx < 0 || nx > W - 120 || ny < 0 || ny > H - 40) { nx = Math.random() * (W - 120); ny = Math.random() * (H - 40); }
      setEnter({ x: nx, y: ny });
      if (chaos >= 2) {
        setCancel({ x: nx - 40, y: ny });
        setForgot({ x: nx + 40, y: ny + 4 });
      }
      if (chaos >= 3 && !calm && Math.random() < 0.12 && !gone) {
        setBoom({ id: Date.now(), x: nx + 60, y: ny + 20 });
        setGone(true);
        setTimeout(() => { setGone(false); setBoom(null); setEnter({ x: Math.random() * (W - 120), y: Math.random() * (H - 40) }); }, 1400);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [chaos, calm, gone]);

  const btn = "absolute rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 ease-out select-none";
  return (
    <div ref={box} className="relative mx-auto" style={{ width: W, height: H }}>
      <span aria-hidden className="absolute left-2 top-2 text-2xl text-primary transition-transform" style={{ transform: `rotate(${arrow}rad)` }}>➜</span>
      <span className="absolute right-0 top-3 text-[11px] text-muted-foreground">{chaos >= 3 ? "Clique ali ⬅ (ou não)" : "Clique em Entrar ⬇"}</span>
      {!gone && (
        <button
          type="button"
          onClick={() => { onAttempt(); setEnter({ x: Math.random() * (W - 120), y: Math.random() * (H - 40) }); }}
          className={`${btn} z-10 w-[120px] bg-primary text-primary-foreground hover:bg-primary/90 ${chaos >= 4 ? "animate-shake" : ""}`}
          style={{ left: enter.x, top: enter.y, transform: chaos >= 3 ? `rotate(${(enter.x % 20) - 10}deg)` : undefined }}
        >
          Entrar
        </button>
      )}
      <button type="button" onClick={() => setCancel({ x: Math.random() * (W - 100), y: Math.random() * (H - 40) })}
        className={`${btn} z-20 border border-input bg-card text-foreground`} style={{ left: cancel.x, top: cancel.y }}>
        Cancelar
      </button>
      <button type="button" onClick={() => setForgot({ x: Math.random() * (W - 120), y: Math.random() * (H - 40) })}
        className={`${btn} z-20 bg-secondary text-secondary-foreground`} style={{ left: forgot.x, top: forgot.y }}>
        Esqueci a senha
      </button>
      {boom && <Particles key={boom.id} x={boom.x} y={boom.y} />}
    </div>
  );
}
