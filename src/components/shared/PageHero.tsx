import { Button } from "@/components/shared/Button";
import { ContentImage } from "@/components/shared/ContentImage";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imagePosition = "center",
  action = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: React.CSSProperties["objectPosition"];
  action?: boolean;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero__image">
        <ContentImage src={image} alt={imageAlt} priority sizes="100vw" objectPosition={imagePosition} />
      </div>
      <div className="page-hero__scrim" />
      <div className="page-hero__content shell">
        <p className="eyebrow eyebrow--lime">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__description">{description}</p>
        {action && <Button href="/book-consultation" analyticsEvent="consultation_start">Request a consultation <span aria-hidden="true">↗</span></Button>}
      </div>
    </section>
  );
}
