"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccomplishmentForm } from "@/components/AccomplishmentForm";
import { updateAccomplishment, deleteAccomplishment } from "@/app/actions";
import { parseArray, STRENGTH_COLORS, STRENGTH_LABELS } from "@/lib/utils";
import type { SerializedAccomplishment } from "@/lib/serialize";

interface Props {
  entry: SerializedAccomplishment;
}

export function EntryDetail({ entry }: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const tools = parseArray(entry.tools);
  const tags = parseArray(entry.tags);
  const skills = parseArray(entry.skills);

  const boundUpdate = updateAccomplishment.bind(null, entry.id);

  if (mode === "edit") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h1 style={{ fontSize: 16, fontWeight: 600 }}>Edit Entry</h1>
          <button
            onClick={() => setMode("view")}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12 }}
          >
            Cancel
          </button>
        </div>
        <AccomplishmentForm
          action={boundUpdate}
          submitLabel="Update"
          defaultValues={{
            date: entry.date.split("T")[0],
            title: entry.title,
            description: entry.description ?? "",
            category: entry.category,
            tools: tools.join(", "),
            impact: entry.impact ?? "",
            result: entry.result ?? "",
            timeSpent: entry.timeSpent,
            tags: tags.join(", "),
            skills: skills.join(", "),
            resumeStrength: entry.resumeStrength,
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>{entry.title}</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setMode("edit")}
            style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12 }}
          >
            Edit
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ background: "none", border: "none", color: "#ef4444", fontSize: 12 }}
            >
              Delete
            </button>
          ) : (
            <span style={{ fontSize: 12 }}>
              <span style={{ color: "#ef4444", marginRight: 6 }}>Sure?</span>
              <button
                onClick={async () => {
                  await deleteAccomplishment(entry.id);
                  router.push("/history");
                }}
                style={{ background: "none", border: "none", color: "#ef4444", fontSize: 12, fontWeight: 600 }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, marginLeft: 6 }}
              >
                No
              </button>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "6px 16px" }}>
        <Row label="Date" value={entry.date.split("T")[0]} />
        <Row label="Category" value={entry.category} />
        <Row
          label="Strength"
          value={
            <span style={{ color: STRENGTH_COLORS[entry.resumeStrength] }}>
              {"★".repeat(entry.resumeStrength)} {STRENGTH_LABELS[entry.resumeStrength]}
            </span>
          }
        />
        {entry.description && <Row label="Description" value={entry.description} />}
        {entry.impact && <Row label="Impact" value={entry.impact} />}
        {entry.result && <Row label="Result" value={entry.result} />}
        {entry.timeSpent != null && <Row label="Time Spent" value={`${entry.timeSpent}h`} />}
        {tools.length > 0 && <Row label="Tools" value={tools.join(", ")} />}
        {skills.length > 0 && <Row label="Skills" value={skills.join(", ")} />}
        {tags.length > 0 && <Row label="Tags" value={tags.join(", ")} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", paddingTop: 4 }}>
        {label}
      </span>
      <span style={{ borderBottom: "1px solid var(--border)", paddingBottom: 6, paddingTop: 4 }}>
        {value}
      </span>
    </>
  );
}
