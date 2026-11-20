import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FinalCta } from "@/components/shared/FinalCta";
import { TrainerCard } from "@/components/shared/TrainerCard";
import { getTrainers } from "@/services/content.service";
import { ApiError } from "@/lib/api/client";
import { ContentNotice } from "@/components/shared/ContentNotice";

export const metadata: Metadata = {
  title: "Meet the Trainers",
  description: "Meet the Forge & Form coaching team and explore personal training in Portland, Oregon.",
  openGraph: {
    title: "Meet the Forge & Form Coaches | Portland",
    description: "Learn about the coaches and personal training approach at Forge & Form.",
    images: [{ url: "/images/a3.jpg", width: 1200, height: 800, alt: "The Forge & Form training community" }],
  },
};

export const revalidate = 300;

export default async function TrainersPage() {
  let trainers: Awaited<ReturnType<typeof getTrainers>> = [];
  let errorMessage = "";
  try {
    trainers = await getTrainers();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    errorMessage = error.message;
  }

  return (
    <>
      <PageHero eyebrow="Your people, your pace" title="Meet your coaches." description="Thoughtful coaching starts with listening. Learn about our coaches and connect with us about finding the right fit." image="/images/h6.jpeg" imageAlt="A trainer team gathering in the studio" imagePosition="center top" />
      <section className="content-section section-light">
        <div className="shell">
          <div className="content-section__intro"><p className="eyebrow">Meet the team</p><h2 className="page-section-title">Meet the coaches.</h2></div>
          {errorMessage
            ? <ContentNotice message={`Trainers could not be loaded: ${errorMessage}`} error />
            : trainers.length
              ? <>{trainers.some((trainer) => trainer.isSample) && <p className="demo-note">Sample coach profiles and credentials—verify details before publication.</p>}<div className="trainer-grid">{trainers.map((trainer, index) => <TrainerCard trainer={trainer} index={index} key={trainer.id ?? trainer.slug} />)}</div></>
              : <ContentNotice message="No trainer profiles are currently available." />}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
