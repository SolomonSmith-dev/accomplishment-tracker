import { prisma } from "@/lib/prisma";
import { parseArray, STRENGTH_COLORS } from "@/lib/utils";
import { HistoryFilters } from "./HistoryFilters";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category ?? "";
  const from = params.from ?? "";
  const to = params.to ?? "";

  const where: Prisma.AccomplishmentWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
      { skills: { contains: q } },
    ];
  }
  if (category) {
    where.category = category;
  }
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to + "T23:59:59");
  }

  const entries = await prisma.accomplishment.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>History</h1>
      <HistoryFilters />

      {entries.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No entries found.</p>
      ) : (
        <div>
          {entries.map((entry) => {
            const tags = parseArray(entry.tags);
            return (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  padding: "8px 0",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, width: 72 }}>
                  {entry.date.toISOString().split("T")[0]}
                </span>
                <span style={{ flex: 1 }}>{entry.title}</span>
                {entry.result && (
                  <span style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.result}
                  </span>
                )}
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{entry.category}</span>
                <span style={{ fontSize: 11, color: STRENGTH_COLORS[entry.resumeStrength] }}>
                  {"*".repeat(entry.resumeStrength)}
                </span>
                {tags.length > 0 && (
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {tags.slice(0, 3).join(", ")}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
