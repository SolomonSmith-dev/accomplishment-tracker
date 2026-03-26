import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { ResumeGenerator } from "./ResumeGenerator";

export default async function ResumePage() {
  const entries = await prisma.accomplishment.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Resume Bullet Generator</h1>
      <ResumeGenerator entries={entries.map(serialize)} />
    </div>
  );
}
