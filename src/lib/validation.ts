import { CATEGORIES } from "./utils";

export type FieldErrors = Partial<
  Record<"title" | "date" | "category" | "resumeStrength" | "timeSpent" | "_form", string>
>;

export function validateAccomplishment(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};

  // Title: required, min 3 chars
  const title = formData.get("title") as string | null;
  if (!title || title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  // Date: required, parseable
  const date = formData.get("date") as string | null;
  if (!date) {
    errors.date = "Date is required.";
  } else if (isNaN(new Date(date).getTime())) {
    errors.date = "Invalid date.";
  }

  // Category: must be in allowed list
  const category = formData.get("category") as string | null;
  if (!category || !(CATEGORIES as readonly string[]).includes(category)) {
    errors.category = "Select a valid category.";
  }

  // Resume strength: 1-5
  const strength = Number(formData.get("resumeStrength"));
  if (isNaN(strength) || strength < 1 || strength > 5) {
    errors.resumeStrength = "Strength must be between 1 and 5.";
  }

  // Time spent: optional, but if provided must be positive
  const timeSpent = formData.get("timeSpent") as string | null;
  if (timeSpent && timeSpent.trim() !== "") {
    const val = Number(timeSpent);
    if (isNaN(val) || val < 0) {
      errors.timeSpent = "Time spent must be a positive number.";
    }
  }

  return errors;
}
