"use client";

import { useState } from "react";
import { parseArray, CATEGORIES, STRENGTH_COLORS } from "@/lib/utils";
import type { SerializedAccomplishment } from "@/lib/serialize";

const ACTION_VERBS: Record<string, string[]> = {
  Engineering: ["Engineered", "Built", "Developed", "Implemented", "Designed", "Architected"],
  Leadership: ["Led", "Directed", "Coordinated", "Drove", "Spearheaded", "Managed"],
  Communication: ["Communicated", "Presented", "Documented", "Authored", "Facilitated"],
  "Process Improvement": ["Streamlined", "Optimized", "Automated", "Improved", "Standardized"],
  Mentoring: ["Mentored", "Coached", "Trained", "Guided", "Onboarded"],
  Delivery: ["Delivered", "Shipped", "Launched", "Released", "Deployed"],
  Research: ["Researched", "Analyzed", "Evaluated", "Investigated", "Assessed"],
  Other: ["Accomplished", "Completed", "Executed", "Achieved"],
};

const STRIP_PREFIXES = /^(I |We |Did |Had |Have |Was |Been )/i;

// All verbs flattened for detecting if title already starts with one
const ALL_VERBS = new Set(Object.values(ACTION_VERBS).flat().map((v) => v.toLowerCase()));

function generateBullet(entry: SerializedAccomplishment): string {
  const tools = parseArray(entry.tools);
  const verbs = ACTION_VERBS[entry.category] ?? ACTION_VERBS.Other;

  let title = entry.title.replace(STRIP_PREFIXES, "").trim();
  const firstWord = title.split(" ")[0].toLowerCase();

  // If title already starts with a strong action verb, use it as-is
  const startsWithVerb = ALL_VERBS.has(firstWord);
  let bullet: string;

  if (startsWithVerb) {
    bullet = title;
  } else {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    title = title.charAt(0).toLowerCase() + title.slice(1);
    bullet = `${verb} ${title}`;
  }

  if (tools.length > 0) {
    bullet += ` using ${tools.join(", ")}`;
  }
  if (entry.impact) {
    bullet += `, ${entry.impact.charAt(0).toLowerCase() + entry.impact.slice(1)}`;
  }
  if (entry.result) {
    bullet += ` — ${entry.result}`;
  }

  return bullet;
}

interface Props {
  entries: SerializedAccomplishment[];
}

export function ResumeGenerator({ entries }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minStrength, setMinStrength] = useState(1);
  const [copied, setCopied] = useState(false);

  const filtered = entries.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false;
    if (e.resumeStrength < minStrength) return false;
    return true;
  });

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((e) => e.id)));
    }
  };

  const selectedEntries = entries.filter((e) => selected.has(e.id));
  const bullets = selectedEntries.map(generateBullet);

  const copyAll = async () => {
    await navigator.clipboard.writeText(bullets.map((b) => `• ${b}`).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Left: entry selection */}
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ maxWidth: 160 }}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={minStrength}
            onChange={(e) => setMinStrength(Number(e.target.value))}
            style={{ maxWidth: 120 }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>★ {n}+</option>
            ))}
          </select>
          <button
            onClick={selectAll}
            style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12 }}
          >
            {selected.size === filtered.length ? "Deselect all" : "Select all"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No entries match filters.</p>
        ) : (
          filtered.map((entry) => (
            <label
              key={entry.id}
              style={{
                display: "flex",
                gap: 8,
                padding: "6px 0",
                borderTop: "1px solid var(--border)",
                cursor: "pointer",
                alignItems: "baseline",
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(entry.id)}
                onChange={() => toggle(entry.id)}
                style={{ width: "auto", marginTop: 2 }}
              />
              <span style={{ flex: 1 }}>{entry.title}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {entry.date.split("T")[0]}
              </span>
              <span style={{ fontSize: 11, color: STRENGTH_COLORS[entry.resumeStrength] }}>
                {"★".repeat(entry.resumeStrength)}
              </span>
            </label>
          ))
        )}
      </div>

      {/* Right: generated bullets */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            Generated Bullets ({bullets.length})
          </h2>
          {bullets.length > 0 && (
            <button
              onClick={copyAll}
              style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12 }}
            >
              {copied ? "Copied!" : "Copy all"}
            </button>
          )}
        </div>

        {bullets.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Select entries to generate resume bullets.</p>
        ) : (
          bullets.map((bullet, i) => (
            <div
              key={selectedEntries[i].id}
              style={{
                borderLeft: `2px solid ${STRENGTH_COLORS[selectedEntries[i].resumeStrength]}`,
                paddingLeft: 12,
                paddingBottom: 8,
                marginBottom: 8,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {bullet}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
