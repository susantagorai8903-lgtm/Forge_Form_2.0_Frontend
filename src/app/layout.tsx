import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getLocations, loadContent } from "@/services/content.service";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://forgeandform.com"),
  title: {
    default: "Forge & Form | Personal Training in Portland, Oregon",
    template: "%s | Forge & Form",
  },
  description: "Personalized strength training, personal coaching, mobility, and wellness at Forge & Form in Portland, Oregon.",
  openGraph: {
    type: "website",
    siteName: "Forge & Form Personal Training",
    title: "Forge & Form | Personal Training in Portland, Oregon",
    description: "Personalized training. Expert coaching. Sustainable results.",
    images: [{ url: "/images/a3.jpg", width: 1200, height: 800, alt: "The Forge & Form training community" }],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { items: locations } = await loadContent(getLocations());
  const location = locations[0];
  const business = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Forge & Form Personal Training",
    ...(location?.phone ? { telephone: location.phone } : {}),
    ...(location?.email ? { email: location.email } : {}),
    ...(location ? {
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address,
        addressLocality: location.city,
        addressRegion: location.state,
        postalCode: location.postal_code,
        addressCountry: location.country,
      },
    } : {}),
  };
  const businessJson = JSON.stringify(business).replace(/</g, "\\u003c");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <SmoothScroll />
        <main id="main-content">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: businessJson }} />
      </body>
    </html>
  );
}
