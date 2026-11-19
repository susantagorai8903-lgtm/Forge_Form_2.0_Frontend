import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { getLocations, loadContent } from "@/services/content.service";
import { BrandName } from "@forge-form/shared/chrome";

export async function Footer() {
  const { items: locations, error } = await loadContent(getLocations());
  const location = locations[0];
  return (
    <footer className="footer">
      <div className="footer__top shell">
        <div className="footer__brand">
          <Link href="/" className="brand brand--footer" aria-label="Forge & Form home">
            <BrandName className="brand__name" />
          </Link>
          <p>Personal training for real life. Build strength, find your rhythm, and move forward with a plan made for you.</p>
        </div>
        <div className="footer__column">
          <h2>Explore</h2>
          <Link href="/about">Our approach</Link><Link href="/programs">Programs</Link><Link href="/trainers">Our coaches</Link><Link href="/testimonials">Client stories</Link><Link href="/blog">The journal</Link>
        </div>
        <div className="footer__column">
          <h2>Get in touch</h2>
          {location?.phone && <a href={`tel:${location.phone}`}>{location.phone}</a>}
          {location?.email && <a href={`mailto:${location.email}`}>{location.email}</a>}
          {location && <p>{location.address}<br />{location.city}, {location.state} {location.postal_code}</p>}
          {!location && <p role={error ? "alert" : "status"}>{error ? "Studio details could not be loaded." : "Studio contact details are not currently published."}</p>}
          <Link href="/locations">Find the studio <MoveUpRight size={13} /></Link>
        </div>
      </div>
      <div className="footer__bottom shell">
        <span>© {new Date().getFullYear()} Forge & Form Personal Training</span>
        <span>Made for movement</span>
        <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </footer>
  );
}
