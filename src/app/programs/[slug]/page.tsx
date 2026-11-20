import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/shared/Button";
import { FinalCta } from "@/components/shared/FinalCta";
import { PageHero } from "@/components/shared/PageHero";
import { ContentImage } from "@/components/shared/ContentImage";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { getProgram } from "@/services/content.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const program = await getProgram(slug);
    return { title: program.title, description: program.summary };
  } catch (error) {
    if (error instanceof ApiError) return {};
    throw error;
  }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let program;
  try {
    program = await getProgram(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError) return <section className="content-section section-light"><div className="shell"><ContentNotice message={`Program details could not be loaded: ${error.message}`} error /></div></section>;
    throw error;
  }

  return (
    <>
      <PageHero eyebrow={program.eyebrow} title={program.title} description={program.summary} image={program.image || "/images/h5.jpeg"} imageAlt={program.alt} />
      <section className="content-section section-light">
        <div className="shell program-detail__split">
          <div className="program-detail__image"><ContentImage src={program.image} alt={program.alt} sizes="(max-width: 800px) 90vw, 52vw" /></div>
          <div className="program-detail__body">
            <p className="eyebrow">A personal way to move forward</p>
            <h2>Make it work<br />for your life.</h2>
            <p>{program.description}</p>
            <ul className="benefit-list">{program.benefits.map((benefit) => <li key={benefit}><Check size={15} aria-hidden="true" />{benefit}</li>)}</ul>
            <p className="program-detail__suitable"><strong>Who it’s for:</strong> {program.suitableFor}</p>
            <Button href="/book-consultation">Talk with a coach <span aria-hidden="true">↗</span></Button>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
