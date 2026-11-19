import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ContentManager } from "@/components/ContentManager";

export default async function ContentPage() {
  const cookieJar = await cookies();
  if (!cookieJar.has("ff_admin_access") && !cookieJar.has("ff_admin_refresh")) redirect("/admin/login");
  return <ContentManager />;
}
