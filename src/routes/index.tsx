import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonSquad } from "@/components/nexora/ButtonSquad";
import { FakeCursor } from "@/components/nexora/FakeCursor";
import { HoldButton } from "@/components/nexora/HoldButton";
import { DOGS, DogSvg } from "@/components/nexora/Dogs";
import { ERRORS, PASSWORD_RULES, ROLES, pick, scramble } from "@/components/nexora/chaos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora Corp. — Portal Corporativo de Acesso" },
      { name: "description", content: "Acesse o portal seguro da Nexora Corp. (site de humor: o login é praticamente impossível)." },
      { property: "og:title", content: "Nexora Corp. — Portal Corporativo" },
      { property: "og:description", content: "Um login corporativo sério. Sério mesmo. Tente entrar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CAPTCHA = [
  { label: "Segunda-feira", feeling: true },
  { label: "Uma planilha", feeling: false },
  { label: "Café frio", feeling: true },
  { label: "Um grampeador", feeling: false },
  { label: "Reunião às 18h", feeling: true },
  { label: "Um clipe", feeling: false },
];

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function Label({ text, chaos }: { text: string; chaos: number }) {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (chaos < 3) { setShown(text); return; }
    const id = setInterval(() => setShown((s) => (s === text ? scramble(text) : text)), 2200 + Math.random() * 1500);
    return () => clearInterval(id);
  }, [chaos, text]);
  return <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{shown}</label>;
}

const input = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring";

function Index() {
  const calm = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [rule, setRule] = useState<string>(PASSWORD_RULES[0]!);
  const [f, setF] = useState({ name: "", birth: "", email: "", email2: "", phone: "", pass: "", pass2: "", dog: "", role: ROLES[0]!, synergy: 50, terms: false });
  const [captcha, setCaptcha] = useState<number[]>([]);
  const [session, setSession] = useState(90);
  const [won, setWon] = useState<null | { dog: number; time: string }>(null);
  const [synergyNudge, setSynergyNudge] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => { startedAt.current = Date.now(); }, []);
  const chaos = Math.min(4, attempts);

  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setSession((s) => {
      if (s <= 1) { setError("Sua sessão expirou antes de começar. Renovamos por cortesia."); return 90 - chaos * 15; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [chaos, won]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v: string | boolean | number = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    if (k === "terms" && v && chaos >= 2 && Math.random() < 0.5) { v = false; setError("Você aceitou rápido demais. Leia as 40 cláusulas."); }
    setF((p) => ({ ...p, [k]: v }));
  };

  const captchaOk = CAPTCHA.every((c, i) => c.feeling === captcha.includes(i));
  const filled = f.name && f.birth && f.email && f.email === f.email2 && f.phone && f.pass && f.pass === f.pass2 && f.dog && f.role !== ROLES[0] && f.terms;
  const ready = attempts >= 7 && captchaOk && !!filled;

  const attempt = useCallback(() => {
    setAttempts((a) => a + 1);
    setRule(pick(PASSWORD_RULES));
    if (!filled) setError("Preencha todos os campos (com dados fictícios). " + pick(ERRORS));
    else if (!captchaOk) setError("Captcha incorreto. Algumas fotos têm sentimentos, sabia?");
    else setError(pick(ERRORS));
  }, [filled, captchaOk]);

  const win = useCallback(() => {
    const s = Math.round((Date.now() - startedAt.current) / 1000);
    setWon({ dog: Math.floor(Math.random() * DOGS.length), time: s >= 60 ? `${Math.floor(s / 60)} min e ${s % 60} s` : `${s} segundos` });
  }, []);

  if (won) {
    const dog = DOGS[won.dog] ?? DOGS[0]!;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy p-6 text-center text-navy-foreground">
        <div className="animate-pop rounded-full bg-card p-6"><DogSvg dog={dog} /></div>
        <h1 className="font-display text-3xl">Login realizado com sucesso!</h1>
        <p className="max-w-md text-lg">{dog.caption.replace("{t}", won.time)}</p>
        <p className="text-sm opacity-70">Tentativas: {attempts}. Recarregue a página para perder tempo de novo.</p>
      </main>
    );
  }

  const shake = chaos >= 4 && !calm ? "animate-shake" : "";

  return (
    <main className="grid min-h-screen lg:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <FakeCursor chaos={calm ? 0 : chaos} />
      <aside className="corporate-grid relative flex flex-col justify-between bg-navy p-8 text-navy-foreground lg:p-14">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36"><path d="M4 32 L18 4 L32 32 Z" fill="none" stroke="var(--gold)" strokeWidth="3" /><circle cx="18" cy="22" r="4" fill="var(--gold)" /></svg>
          <span className="font-display text-xl tracking-wide">Nexora Corp.</span>
        </div>
        <div className="my-10 max-w-md">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Portal do Colaborador</p>
          <h1 className="font-display text-4xl leading-tight">Soluções integradas para resultados sinérgicos.</h1>
          <p className="mt-4 text-sm opacity-70">Alavancando paradigmas disruptivos desde o último trimestre. Acesso restrito a colaboradores autorizados.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[["99,9%", "Uptime de reuniões"], ["0", "Logins concluídos hoje"], [`${attempts}`, "Suas tentativas"]].map(([a, b]) => (
            <div key={b}><div className="font-display text-2xl text-gold">{a}</div><div className="opacity-60">{b}</div></div>
          ))}
        </div>
      </aside>

      <section className={`flex flex-col items-center justify-center p-6 lg:p-12 ${shake}`}>
        <form className="w-full max-w-md space-y-4" noValidate>
          <div>
            <h2 className="font-display text-2xl">Acesso seguro</h2>
            <p className="text-sm text-muted-foreground">Login obrigatório. Sessão expira em <span className="font-semibold text-foreground">{session}s</span>.</p>
            <p className="mt-2 rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground">⚠ Use dados fictícios. Nada é enviado ou salvo.</p>
          </div>

          {error && <div key={error + attempts} className="animate-pop rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label chaos={chaos} text="Nome completo" /><input className={input} value={f.name} onChange={set("name")} /></div>
            <div><Label chaos={chaos} text="Data de nascimento" /><input type="date" className={input} value={f.birth} onChange={set("birth")} /></div>
            <div><Label chaos={chaos} text="Telefone" /><input className={input} value={f.phone} onChange={set("phone")} /></div>
            <div><Label chaos={chaos} text="E-mail" /><input type="email" className={input} value={f.email} onChange={set("email")} /></div>
            <div><Label chaos={chaos} text="Confirmar e-mail" /><input type="email" className={input} value={f.email2} onChange={set("email2")} onPaste={(e) => { e.preventDefault(); setError("Colar é coisa de estagiário. Digite."); }} /></div>
            <div><Label chaos={chaos} text="Senha" /><input type="password" className={input} value={f.pass} onChange={set("pass")} /></div>
            <div><Label chaos={chaos} text="Confirmar senha" /><input type="password" className={input} value={f.pass2} onChange={set("pass2")} /></div>
            <p className="col-span-2 -mt-1 text-xs text-muted-foreground">Regra atual: {rule}</p>
            <div className="col-span-2"><Label chaos={chaos} text="Nome do seu primeiro cachorro escrito ao contrário" /><input className={input} value={f.dog} onChange={set("dog")} placeholder="ex.: lekoR" /></div>
            <div className="col-span-2"><Label chaos={chaos} text="Cargo" />
              <select className={input} value={f.role} onChange={set("role")}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="col-span-2"><Label chaos={chaos} text={`Nível de sinergia: ${f.synergy}%`} />
              <input type="range" className="w-full accent-primary transition-transform duration-300" style={{ transform: `translateX(${synergyNudge}px)` }}
                value={f.synergy} onChange={set("synergy")}
                onPointerEnter={() => chaos >= 1 && !calm && setSynergyNudge((Math.random() - 0.5) * 120)} />
            </div>
          </div>

          <fieldset className="rounded-md border p-3">
            <legend className="px-1 text-xs font-medium text-muted-foreground">Captcha: selecione todas as opções com sentimentos</legend>
            <div className="grid grid-cols-3 gap-2">
              {CAPTCHA.map((c, i) => (
                <button type="button" key={c.label}
                  onClick={() => setCaptcha((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
                  className={`rounded border px-2 py-3 text-xs transition ${captcha.includes(i) ? "border-primary bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={f.terms} onChange={set("terms")} className="mt-0.5 accent-primary" />
            Li e concordo com as 40 cláusulas dos Termos de Sinergia, incluindo a cláusula 27 (sobre cachorros).
          </label>

          {ready ? <HoldButton onDone={win} /> : <ButtonSquad chaos={chaos} calm={calm} onAttempt={attempt} />}
          {!ready && attempts >= 7 && <p className="text-center text-xs text-muted-foreground">Dica secreta: com tudo certinho, algo diferente aparece aqui.</p>}
        </form>
        <footer className="mt-10 text-center text-[11px] text-muted-foreground">© Nexora Corp. (fictícia) · Site de humor. Nenhum dado é enviado ou salvo.</footer>
      </section>
    </main>
  );
}
