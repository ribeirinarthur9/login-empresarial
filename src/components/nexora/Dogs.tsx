/** Original SVG dog illustrations for the reward screen. */
type Dog = { fur: string; ear: string; extra: "glasses" | "tongue" | "tie" | "crown" | "laugh" | "cap" | "wink" | "monocle"; caption: string };

export const DOGS: Dog[] = [
  { fur: "oklch(0.75 0.1 70)", ear: "oklch(0.5 0.08 50)", extra: "glasses", caption: "Parabéns! Você gastou {t} pra entrar num site que não existe. 😎" },
  { fur: "oklch(0.9 0.03 90)", ear: "oklch(0.6 0.06 60)", extra: "tongue", caption: "Hahaha, {t} da sua vida. Eu passei esse tempo dormindo." },
  { fur: "oklch(0.35 0.03 50)", ear: "oklch(0.25 0.02 50)", extra: "tie", caption: "Bem-vindo à Nexora. Sua reunião foi cancelada há {t}." },
  { fur: "oklch(0.8 0.08 50)", ear: "oklch(0.55 0.1 40)", extra: "crown", caption: "O verdadeiro CEO sou eu. Você perdeu {t} pra descobrir." },
  { fur: "oklch(0.95 0.01 90)", ear: "oklch(0.3 0.02 60)", extra: "laugh", caption: "KKKKK {t} clicando num botão fujão. Lenda." },
  { fur: "oklch(0.6 0.08 60)", ear: "oklch(0.4 0.06 50)", extra: "cap", caption: "Login concluído. Recompensa: nada. Tempo investido: {t}." },
  { fur: "oklch(0.7 0.05 80)", ear: "oklch(0.45 0.04 70)", extra: "wink", caption: "Eu vi tudo. {t}. Não vou contar pra ninguém. 😉" },
  { fur: "oklch(0.85 0.06 75)", ear: "oklch(0.6 0.08 55)", extra: "monocle", caption: "Esplêndido. {t} de pura sinergia desperdiçada." },
];

export function DogSvg({ dog }: { dog: Dog }) {
  const n = "var(--navy)";
  return (
    <svg viewBox="0 0 200 200" className="h-56 w-56 animate-float">
      <ellipse cx="55" cy="80" rx="22" ry="40" fill={dog.ear} transform="rotate(20 55 80)" />
      <ellipse cx="145" cy="80" rx="22" ry="40" fill={dog.ear} transform="rotate(-20 145 80)" />
      <circle cx="100" cy="105" r="62" fill={dog.fur} />
      <ellipse cx="100" cy="135" rx="34" ry="26" fill="oklch(0.97 0.01 90)" />
      {dog.extra === "wink" ? <path d="M70 95 q8 -6 16 0" stroke={n} strokeWidth="4" fill="none" /> : <circle cx="78" cy="95" r="7" fill={n} />}
      <circle cx="122" cy="95" r="7" fill={n} />
      <ellipse cx="100" cy="120" rx="11" ry="8" fill={n} />
      {dog.extra === "laugh"
        ? <path d="M80 135 q20 25 40 0 z" fill="var(--destructive)" stroke={n} strokeWidth="3" />
        : <path d="M88 133 q12 10 24 0" stroke={n} strokeWidth="3" fill="none" />}
      {dog.extra === "tongue" && <ellipse cx="106" cy="145" rx="8" ry="11" fill="var(--destructive)" />}
      {dog.extra === "glasses" && <g fill={n}><rect x="62" y="85" width="30" height="18" rx="4" /><rect x="108" y="85" width="30" height="18" rx="4" /><rect x="92" y="90" width="16" height="4" /></g>}
      {dog.extra === "tie" && <path d="M100 165 l-10 8 l10 25 l10 -25 z" fill="var(--destructive)" />}
      {dog.extra === "crown" && <path d="M70 50 l10 -25 l20 18 l20 -18 l10 25 z" fill="var(--gold)" stroke={n} strokeWidth="2" />}
      {dog.extra === "cap" && <path d="M55 60 q45 -40 90 0 l20 4 l-110 0 z" fill="var(--primary)" />}
      {dog.extra === "monocle" && <circle cx="122" cy="95" r="14" fill="none" stroke="var(--gold)" strokeWidth="3" />}
    </svg>
  );
}
