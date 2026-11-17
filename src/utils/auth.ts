const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Indique ton email.";
  if (!EMAIL_RE.test(v)) return "Cet email n'est pas valide.";
  return undefined;
}

export function validateNewPassword(value: string): string | undefined {
  if (value.length < 8) return "8 caractères minimum.";
  return undefined;
}
