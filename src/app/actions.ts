"use server";

import { prisma } from "@/lib/prisma";
import { validateAccomplishment, type FieldErrors } from "@/lib/validation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/** Convert "React, TypeScript, Docker" → '["React","TypeScript","Docker"]' */
function csvToJson(value: string | null): string {
  if (!value || value.trim() === "") return "[]";
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return JSON.stringify(items);
}

export type ActionResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

function buildData(formData: FormData) {
  const timeSpentRaw = formData.get("timeSpent") as string | null;
  const timeSpent =
    timeSpentRaw && timeSpentRaw.trim() !== ""
      ? parseFloat(timeSpentRaw)
      : null;

  return {
    date: new Date(formData.get("date") as string),
    title: (formData.get("title") as string).trim(),
    description: (formData.get("description") as string) || null,
    category: formData.get("category") as string,
    tools: csvToJson(formData.get("tools") as string),
    impact: (formData.get("impact") as string) || null,
    result: (formData.get("result") as string) || null,
    timeSpent,
    tags: csvToJson(formData.get("tags") as string),
    skills: csvToJson(formData.get("skills") as string),
    resumeStrength: Math.min(5, Math.max(1, Number(formData.get("resumeStrength")) || 3)),
  };
}

export async function createAccomplishment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const errors = validateAccomplishment(formData);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  try {
    await prisma.accomplishment.create({ data: buildData(formData) });
  } catch (e) {
    return {
      ok: false,
      errors: { _form: `Database error: ${e instanceof Error ? e.message : "Unknown error"}` },
    };
  }

  revalidatePath("/");
  revalidatePath("/history");
  redirect("/history");
}

export async function updateAccomplishment(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const errors = validateAccomplishment(formData);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  try {
    await prisma.accomplishment.update({
      where: { id },
      data: buildData(formData),
    });
  } catch (e) {
    return {
      ok: false,
      errors: { _form: `Database error: ${e instanceof Error ? e.message : "Unknown error"}` },
    };
  }

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/entry/${id}`);
  return { ok: true };
}

export async function deleteAccomplishment(id: string): Promise<void> {
  await prisma.accomplishment.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/history");
  redirect("/history");
}
