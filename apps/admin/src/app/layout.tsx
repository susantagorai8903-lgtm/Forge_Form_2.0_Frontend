import type { Metadata } from "next";
import { ZoneFooter, ZoneHeader } from "@forge-form/shared/chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin | Forge & Form",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ZoneHeader>
          <a href="/admin">Admin</a>
        </ZoneHeader>
        <main>{children}</main>
        <ZoneFooter links={[{ href: "/", label: "Public website" }, { href: "/admin", label: "Dashboard" }]} />
      </body>
    </html>
  );
}
