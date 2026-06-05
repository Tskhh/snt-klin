import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { CabinetNav } from "@/components/CabinetNav";

export default async function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.status === "PENDING") redirect("/pending");

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 pb-24 md:pb-8">
      <CabinetNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
