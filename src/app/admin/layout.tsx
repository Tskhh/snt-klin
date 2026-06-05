import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/jwt";
import { getSession } from "@/lib/session";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdmin(session.role)) redirect("/cabinet");

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <AdminNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
