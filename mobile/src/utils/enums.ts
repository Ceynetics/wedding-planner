export function displayEnum(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\B\w+/g, (s) => s.toLowerCase());
}

export function toApiEnum(value: string): string {
  return value.toUpperCase().replace(/\s+/g, '_');
}
