"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";
import { useCallback } from "react";

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/history?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
      <input
        placeholder="Search title, tags, skills..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value)}
        style={{ maxWidth: 220 }}
      />
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        style={{ maxWidth: 160 }}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        type="date"
        defaultValue={searchParams.get("from") ?? ""}
        onChange={(e) => updateParam("from", e.target.value)}
        style={{ maxWidth: 140 }}
        title="From date"
      />
      <input
        type="date"
        defaultValue={searchParams.get("to") ?? ""}
        onChange={(e) => updateParam("to", e.target.value)}
        style={{ maxWidth: 140 }}
        title="To date"
      />
      {searchParams.toString() && (
        <button
          onClick={() => router.push("/history")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12 }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
