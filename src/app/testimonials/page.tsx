import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FinalCta } from "@/components/shared/FinalCta";
import { getTestimonials, loadContent } from "@/services/content.service";
import { ContentImage } from "@/components/shared/ContentImage";
import { ContentNotice } from "@/components/shared/ContentNotice";

export const metadata: Metadata = {
  title: "Client Stories",
  description: "Read client stories published by Forge & Form.",
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const { items: testimonials, error } = await loadContent(getTestimonials());
  return (
    <>
      <PageHero eyebrow="Stories in progress" title="Every journey is personal." description="Training is personal—and progress looks different for everyone. Read stories shared by our clients." image="/images/t4.jpeg" imageAlt="Group fitness training in a community setting" />
      <section className="content-section section-light">
        <div className="shell">
          <div className="content-section__intro"><p className="eyebrow">Client stories</p><h2 className="page-section-title">Stories of progress.</h2></div>
          {error
            ? <ContentNotice message={`Client stories could not be loaded: ${error}`} error />
            : testimonials.length
              ? <div className="story-page-grid">{testimonials.map((story, index) => (
                <article className="story-page-card" key={story.id ?? `${story.name}-${index}`}>
                  <div className="story-page-card__image"><ContentImage src={story.image} alt={`Photo shared by ${story.name}`} sizes="(max-width: 700px) 90vw, 45vw" /></div>
                  <div className="story-page-card__content"><p className="eyebrow eyebrow--lime">CLIENT STORY / {String(index + 1).padStart(2, "0")}</p><blockquote>“{story.quote}”</blockquote><span>{story.name}</span></div>
                </article>
              ))}</div>
              : <ContentNotice message="No client stories have been published." />}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
