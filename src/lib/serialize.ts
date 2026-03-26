import type { Accomplishment } from "@/generated/prisma";

/** Serialized version of Accomplishment safe for client components */
export type SerializedAccomplishment = Omit<Accomplishment, "date" | "createdAt" | "updatedAt"> & {
  date: string;
  createdAt: string;
  updatedAt: string;
};

/** Convert Prisma Accomplishment to a client-safe serialized form */
export function serialize(entry: Accomplishment): SerializedAccomplishment {
  return {
    ...entry,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
