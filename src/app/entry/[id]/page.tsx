import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { notFound } from "next/navigation";
import { EntryDetail } from "./EntryDetail";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await prisma.accomplishment.findUnique({ where: { id } });
  if (!entry) notFound();

  return <EntryDetail entry={serialize(entry)} />;
}
