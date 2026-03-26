"use client";

import { useActionState } from "react";
import { CATEGORIES, STRENGTH_LABELS } from "@/lib/utils";
import type { ActionResult } from "@/app/actions";

interface Props {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  defaultValues?: {
    date?: string;
    title?: string;
    description?: string;
    category?: string;
    tools?: string;
    impact?: string;
    result?: string;
    timeSpent?: number | null;
    tags?: string;
    skills?: string;
    resumeStrength?: number;
  };
  submitLabel?: string;
}

export function AccomplishmentForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state && !state.ok ? state.errors : {};

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction}>
      {errors._form && (
        <div style={{ color: "#ef4444", marginBottom: 12, padding: "6px 8px", background: "#1c1017", border: "1px solid #ef4444", borderRadius: 2 }}>
          {errors._form}
        </div>
      )}

      {state?.ok && (
        <div style={{ color: "#22c55e", marginBottom: 12, padding: "6px 8px", background: "#0f1c14", border: "1px solid #22c55e", borderRadius: 2 }}>
          Saved successfully.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Title */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Label text="Title" error={errors.title} />
          <input
            name="title"
            required
            minLength={3}
            defaultValue={defaultValues?.title ?? ""}
            placeholder="Built deployment pipeline for staging"
            style={errors.title ? { borderColor: "#ef4444" } : undefined}
          />
        </div>

        {/* Date + Category */}
        <div>
          <Label text="Date" error={errors.date} />
          <input
            name="date"
            type="date"
            required
            defaultValue={defaultValues?.date ?? today}
            style={errors.date ? { borderColor: "#ef4444" } : undefined}
          />
        </div>
        <div>
          <Label text="Category" error={errors.category} />
          <select
            name="category"
            defaultValue={defaultValues?.category ?? "Engineering"}
            style={errors.category ? { borderColor: "#ef4444" } : undefined}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Label text="Description" />
          <textarea
            name="description"
            rows={2}
            defaultValue={defaultValues?.description ?? ""}
            placeholder="Optional details about what you did"
          />
        </div>

        {/* Impact + Result */}
        <div>
          <Label text="Impact" />
          <input
            name="impact"
            defaultValue={defaultValues?.impact ?? ""}
            placeholder="Unblocked 3 team members"
          />
        </div>
        <div>
          <Label text="Measurable Result" />
          <input
            name="result"
            defaultValue={defaultValues?.result ?? ""}
            placeholder="Reduced deploy time by 40%"
          />
        </div>

        {/* Tools + Skills + Tags + Time */}
        <div>
          <Label text="Tools (comma-separated)" />
          <input
            name="tools"
            defaultValue={defaultValues?.tools ?? ""}
            placeholder="React, TypeScript, Docker"
          />
        </div>
        <div>
          <Label text="Skills (comma-separated)" />
          <input
            name="skills"
            defaultValue={defaultValues?.skills ?? ""}
            placeholder="System design, CI/CD"
          />
        </div>
        <div>
          <Label text="Tags (comma-separated)" />
          <input
            name="tags"
            defaultValue={defaultValues?.tags ?? ""}
            placeholder="backend, infrastructure"
          />
        </div>
        <div>
          <Label text="Time Spent (hours)" error={errors.timeSpent} />
          <input
            name="timeSpent"
            type="number"
            step="0.25"
            min="0"
            defaultValue={defaultValues?.timeSpent ?? ""}
            placeholder="2.5"
            style={errors.timeSpent ? { borderColor: "#ef4444" } : undefined}
          />
        </div>

        {/* Resume Strength */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Label text="Resume Strength" error={errors.resumeStrength} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="resumeStrength"
                  value={n}
                  defaultChecked={n === (defaultValues?.resumeStrength ?? 3)}
                  style={{ width: "auto" }}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {n} {STRENGTH_LABELS[n]}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            padding: "6px 20px",
            borderRadius: 2,
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Label({ text, error }: { text: string; error?: string }) {
  return (
    <div style={{ marginBottom: 3 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
        {text}
      </span>
      {error && <span style={{ fontSize: 11, color: "#ef4444", marginLeft: 8 }}>{error}</span>}
    </div>
  );
}
