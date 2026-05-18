export const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

export const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const pretty = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((item) => pretty(item)).join(" • ");
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${pretty(v)}`)
      .join(", ");
  }
  return "";
};
