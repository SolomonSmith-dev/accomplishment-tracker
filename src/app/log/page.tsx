import { AccomplishmentForm } from "@/components/AccomplishmentForm";
import { createAccomplishment } from "@/app/actions";

export default function LogPage() {
  return (
    <div>
      <h1 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Log Accomplishment</h1>
      <AccomplishmentForm action={createAccomplishment} submitLabel="Log It" />
    </div>
  );
}
