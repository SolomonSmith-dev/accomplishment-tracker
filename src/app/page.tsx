import { prisma } from "@/lib/prisma";
import { STRENGTH_COLORS } from "@/lib/utils";
import Link from "next/link";

function startOfWeek(): Date {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function DashboardPage() {
  const [total, thisWeek, thisMonth, byCategory, recent] = await Promise.all([
    prisma.accomplishment.count(),
    prisma.accomplishment.count({ where: { date: { gte: startOfWeek() } } }),
    prisma.accomplishment.count({ where: { date: { gte: startOfMonth() } } }),
    prisma.accomplishment.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.accomplishment.findMany({
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const avgStrength = total > 0
    ? await prisma.accomplishment.aggregate({ _avg: { resumeStrength: true } })
    : null;

  const avgStr = avgStrength?._avg?.resumeStrength
    ? avgStrength._avg.resumeStrength.toFixed(1)
    : "—";

  return (
    <div>
      {/* Stats line */}
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
        <strong style={{ color: "var(--text)" }}>{total}</strong> total
        {" · "}
        <strong style={{ color: "var(--text)" }}>{thisWeek}</strong> this week
        {" · "}
        <strong style={{ color: "var(--text)" }}>{thisMonth}</strong> this month
        {" · "}
        {"★ "}<strong style={{ color: "var(--text)" }}>{avgStr}</strong> avg strength
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Categories */}
        <div>
          <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 8 }}>
            By Category
          </h2>
          {byCategory.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No data yet.</p>
          ) : (
            byCategory.map((c) => (
              <div key={c.category} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: Math.max(4, (c._count.id / total) * 200), height: 3, background: "var(--accent)", borderRadius: 1 }} />
                <span style={{ fontSize: 12 }}>{c.category}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{c._count.id}</span>
              </div>
            ))
          )}
        </div>

        {/* Recent */}
        <div>
          <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 8 }}>
            Recent
          </h2>
          {recent.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No entries yet. <Link href="/log" style={{ color: "var(--accent)" }}>Log your first win.</Link></p>
          ) : (
            recent.map((entry) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  padding: "6px 0",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--text-muted)", width: 60, flexShrink: 0 }}>
                  {entry.date.toISOString().split("T")[0]}
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entry.title}
                </span>
                <span style={{ fontSize: 11, color: STRENGTH_COLORS[entry.resumeStrength] }}>
                  {"★".repeat(entry.resumeStrength)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
