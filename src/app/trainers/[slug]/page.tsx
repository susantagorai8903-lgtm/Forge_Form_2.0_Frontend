import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { ApiError } from "@/lib/api/client";
import { ContentImage } from "@/components/shared/ContentImage";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { getTrainer } from "@/services/content.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const trainer = await getTrainer(slug);
    const description = `${trainer.title} at Forge & Form Personal Training.`;
    return {
      title: trainer.name,
      description,
      openGraph: {
        title: `${trainer.name} | Forge & Form`,
        description,
        images: [{ url: trainer.image, alt: trainer.alt }],
      },
    };
  } catch (error) {
    if (error instanceof ApiError) return {};
    throw error;
  }
}

export default async function TrainerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let trainer;
  try {
    trainer = await getTrainer(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError) return <section className="content-section section-light"><div className="shell"><ContentNotice message={`Trainer details could not be loaded: ${error.message}`} error /></div></section>;
    throw error;
  }

  return (
    <>
      <section className="content-section section-light">
        <div className="shell">
          <Link className="text-link" href="/trainers"><ArrowLeft size={14} /> Back to the coaches</Link>
          <div className="trainer-profile">
            <div className="trainer-profile__image"><ContentImage src={trainer.image} alt={trainer.alt} priority sizes="(max-width: 800px) 90vw, 45vw" /></div>
            <div className="trainer-profile__body">
              <p className="eyebrow">Meet your coach</p>
              {trainer.isSample && <p className="demo-note">Sample coach profile—verify credentials and details before publication.</p>}
              <h1 className="page-section-title">{trainer.name}</h1>
              <p className="trainer-profile__title">{trainer.title}</p>
              <p>{trainer.bio}</p>
              {trainer.quote && <blockquote className="trainer-profile__quote">“{trainer.quote}”</blockquote>}
              <p className="trainer-profile__experience">{trainer.experience}</p>
              <h2>Coaching focus</h2>
              <ul className="benefit-list">{trainer.specialties.map((specialty) => <li key={specialty}><Check size={15} />{specialty}</li>)}</ul>
              {trainer.certifications && trainer.certifications.length > 0 && <>
                <h2>Certifications</h2>
                <ul className="benefit-list">{trainer.certifications.map((certification) => <li key={certification}><Check size={15} />{certification}</li>)}</ul>
              </>}
              <Button href="/book-consultation">Talk with a coach <ArrowUpRight size={16} /></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
