export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function validationMessage(errors: Record<string, string[]> | undefined): string[] {
  return Object.entries(errors ?? {}).flatMap(([field, messages]) =>
    messages.map((message) => `${field}: ${message}`),
  );
}
