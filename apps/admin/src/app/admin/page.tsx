import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const cookieJar = await cookies();
  if (!cookieJar.has("ff_admin_access") && !cookieJar.has("ff_admin_refresh")) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
