import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ContactManager } from "@/components/ContactManager";

export default async function ContactsPage() {
  const cookieJar = await cookies();
  if (!cookieJar.has("ff_admin_access") && !cookieJar.has("ff_admin_refresh")) redirect("/admin/login");
  return <ContactManager />;
}
