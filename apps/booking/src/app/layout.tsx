import type { Metadata } from "next";
import { ZoneFooter, ZoneHeader } from "@forge-form/shared/chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Request a Consultation | Forge & Form",
  description: "Send Forge & Form a consultation request. Your preferred time is not confirmed until the studio responds.",
};

export default function BookingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ZoneHeader />
        <main>{children}</main>
        <ZoneFooter links={[{ href: "/contact", label: "Contact" }, { href: "/locations", label: "Locations" }]} />
      </body>
    </html>
  );
}
