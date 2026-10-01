export const ERRORS = [
  "Sua senha estava certa, mas expirou há 3 minutos.",
  "E-mail válido demais. Por favor, use um e-mail menos válido.",
  "Detectamos que você é humano. Apenas robôs certificados podem entrar.",
  "Seu cargo não tem sinergia suficiente com seu signo.",
  "O nome do cachorro ao contrário está certo, mas o cachorro discorda.",
  "Erro 418: o servidor é um bule de café e se recusa.",
  "Sessão encerrada por excesso de produtividade.",
  "Sua data de nascimento ainda não foi aprovada pelo RH.",
  "A senha precisa conter uma vogal triste e um número indeciso.",
  "Falha na autenticação: o botão não gostou de você.",
  "Quase! Mas 'quase' não está no nosso plano estratégico.",
];

export const PASSWORD_RULES = [
  "Mínimo de 8 caracteres.",
  "Deve conter exatamente 3 letras maiúsculas e meia.",
  "Não pode conter letras. Nem números.",
  "Deve rimar com 'sinergia'.",
  "Precisa incluir o ano atual em algarismos romanos.",
  "Não pode ser igual a nenhuma senha que você ainda vai criar.",
  "Deve ter mais emojis que consoantes.",
];

export const ROLES = [
  "Selecione seu cargo",
  "Diretor(a) de Reuniões que Poderiam Ser E-mails",
  "Analista Sênior de Planilhas Coloridas",
  "Head de Pensar Fora da Caixa (dentro da caixa)",
  "Estagiário(a) Executivo(a) Global",
  "Gerente de Alinhamentos Desalinhados",
  "CEO do Próprio Sofá",
];

export function scramble(text: string) {
  const arr = text.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]!; arr[i] = arr[j]!; arr[j] = t;
  }
  return arr.join("");
}

export const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)] as T;
