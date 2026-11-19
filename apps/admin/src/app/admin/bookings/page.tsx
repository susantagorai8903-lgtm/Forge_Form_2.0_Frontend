import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BookingManager } from "@/components/BookingManager";

export default async function BookingsPage() {
  const cookieJar = await cookies();
  if (!cookieJar.has("ff_admin_access") && !cookieJar.has("ff_admin_refresh")) redirect("/admin/login");
  return <BookingManager />;
}
