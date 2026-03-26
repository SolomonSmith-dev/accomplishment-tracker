// Safely parse a JSON string array, returning [] on failure
export function parseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// All valid categories — single source of truth
export const CATEGORIES = [
  "Engineering",
  "Leadership",
  "Communication",
  "Process Improvement",
  "Mentoring",
  "Delivery",
  "Research",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Resume strength color mapping (1-5)
export const STRENGTH_COLORS: Record<number, string> = {
  1: "#6b7280", // gray
  2: "#f59e0b", // amber
  3: "#3b82f6", // blue
  4: "#8b5cf6", // violet
  5: "#22c55e", // green
};

// Resume strength labels (1-5)
export const STRENGTH_LABELS: Record<number, string> = {
  1: "Weak",
  2: "Fair",
  3: "Good",
  4: "Strong",
  5: "Excellent",
};
