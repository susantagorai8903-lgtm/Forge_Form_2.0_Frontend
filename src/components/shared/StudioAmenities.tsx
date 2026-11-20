import { SectionHeading } from "@/components/shared/SectionHeading";

const amenities = [
  {
    title: "Built for strength",
    description: "Rogue power racks, calibrated plates, adjustable benches, and a considered selection of free weights.",
  },
  {
    title: "Room to reset",
    description: "Private consultation pods for goal-setting conversations, check-ins, and a little breathing room.",
  },
  {
    title: "Thoughtful details",
    description: "Complimentary towel service and espresso for a more welcoming start or finish to your session.",
  },
];

export function StudioAmenities() {
  return (
    <section className="content-section section-paper">
      <div className="shell">
        <SectionHeading eyebrow="A place to feel at home" title="Studio amenities & equipment." />
        <p className="demo-note">Sample facility details—confirm equipment and services with the studio before publication.</p>
        <div className="amenity-grid">
          {amenities.map((amenity, index) => (
            <article className="info-card" key={amenity.title}>
              <span>0{index + 1}</span>
              <h3>{amenity.title}</h3>
              <p>{amenity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
