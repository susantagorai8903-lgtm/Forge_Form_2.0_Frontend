import { Check } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { SectionHeading } from "@/components/shared/SectionHeading";

const tiers = [
  {
    name: "Foundation 1:1",
    price: "$360",
    cadence: "per 4-week cycle",
    description: "A steady weekly rhythm with coaching built around your starting point.",
    features: ["1 private 50-minute session each week", "Personalized training plan", "Monthly progress check-in"],
  },
  {
    name: "Performance 1:1",
    price: "$640",
    cadence: "per 4-week cycle",
    description: "More coach time and structure for focused, consistent training.",
    features: ["2 private 50-minute sessions each week", "Progressive strength programming", "Weekly coach check-in"],
    featured: true,
  },
  {
    name: "Hybrid Coaching",
    price: "$260",
    cadence: "per 4-week cycle",
    description: "A blend of in-person guidance and independent training support.",
    features: ["1 private 50-minute session each cycle", "Personalized between-session plan", "Weekly remote check-in"],
  },
];

export function PricingSection() {
  return (
    <section className="content-section section-paper pricing-section">
      <div className="shell">
        <SectionHeading eyebrow="Clear options, no guesswork" title="Choose your coaching rhythm." />
        <p className="demo-note">Illustrative preview rates only—not current offers. Confirm rates, terms, and availability with Forge & Form before publishing.</p>
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <article className={`pricing-card${tier.featured ? " pricing-card--featured" : ""}`} key={tier.name}>
              {tier.featured && <p className="pricing-card__badge">MOST COACHING</p>}
              <h3>{tier.name}</h3>
              <p className="pricing-card__description">{tier.description}</p>
              <p className="pricing-card__price">{tier.price}<span>{tier.cadence}</span></p>
              <ul>
                {tier.features.map((feature) => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}
              </ul>
              <Button href="/book-consultation" variant={tier.featured ? "light" : "outline"}>Talk through this option <span aria-hidden="true">↗</span></Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
