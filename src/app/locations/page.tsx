import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { PageHero } from "@/components/shared/PageHero";
import { getLocations, loadContent } from "@/services/content.service";
import { ContentNotice } from "@/components/shared/ContentNotice";

export const metadata: Metadata = {
  title: "Our Location",
  description: "Find Forge & Form Personal Training locations and contact details.",
};

export const revalidate = 300;

export default async function LocationsPage() {
  const locationResult = await loadContent(getLocations());
  const locations = locationResult.items;
  return (
    <>
      <PageHero eyebrow="Your training studio" title="Room to move." description="A welcoming place to build strength, practice movement, and make a little space for yourself." image="/images/h7.jpeg" imageAlt="Interior view of a fitness training studio" action={false} />
      <section className="content-section section-light">
        <div className="shell">
          <div className="content-section__intro"><p className="eyebrow">Find Forge & Form</p><h2 className="section-heading"><span>Come as you are.</span></h2><p>Reach out before your first visit and we’ll help you plan a good place to begin.</p></div>
          {locationResult.error
            ? <ContentNotice message={`Location details could not be loaded: ${locationResult.error}`} error />
            : locations.length
              ? <div className="location-grid">{locations.map((location) => {
                const address = [location.address, location.city, location.state, location.postal_code, location.country].filter(Boolean).join(", ");
                const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                const hours = location.opening_hours ? Object.entries(location.opening_hours) : [];
                return <article className="location-details" key={location.id}>
                  <p className="eyebrow eyebrow--lime">Forge & Form Personal Training</p>
                  <h2>{location.name}</h2>
                  <address>{location.address}<br />{location.city}, {location.state} {location.postal_code}<br />{location.country}</address>
                  {location.phone && <a href={`tel:${location.phone}`}>{location.phone}</a>}
                  {location.email && <a href={`mailto:${location.email}`}>{location.email}</a>}
                  {hours.length > 0
                    ? <div><h3>Opening hours</h3><ul>{hours.map(([day, value]) => <li key={day}>{day}: {value}</li>)}</ul></div>
                    : <p>Opening hours have not been published.</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 25 }}>
                    <Button href="/book-consultation" variant="light">Request a consultation</Button>
                    <a className="button button--outline" href={directions} target="_blank" rel="noreferrer">Get directions <ExternalLink size={15} /></a>
                  </div>
                </article>;
              })}</div>
              : <ContentNotice message="No locations have been published." />}
        </div>
      </section>
    </>
  );
}
