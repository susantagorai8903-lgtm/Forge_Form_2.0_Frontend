import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/shared/Button";
import { PageHero } from "@/components/shared/PageHero";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { ProgramBrowser } from "@/components/programs/ProgramBrowser";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getProgramCategories, getPrograms } from "@/services/content.service";

export const metadata: Metadata = {
  title: "Personal Training Programs",
  description: "Explore personal training programs offered by Forge & Form.",
};

export const revalidate = 300;

export default async function ProgramsPage() {
  let programs: Awaited<ReturnType<typeof getPrograms>> = [];
  let categories: Awaited<ReturnType<typeof getProgramCategories>> = [];
  let programsError = "";
  let categoriesError = "";

  try {
    programs = await getPrograms();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    programsError = error.message;
  }
  try {
    categories = await getProgramCategories();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    categoriesError = error.message;
  }

  return (
    <>
      <PageHero eyebrow="Find your focus" title="Training with purpose." description="Explore coaching designed around your goals, experience, and everyday life. Start where you are; build from there." image="/images/h5.jpeg" imageAlt="A group fitness class in a welcoming studio" />
      <section className="content-section section-light">
        <div className="shell">
          <SectionHeading eyebrow="Find your focus" title="Choose your starting point." />
          {programsError
            ? <ContentNotice message={`Programs could not be loaded: ${programsError}`} error />
            : programs.length > 0
              ? <ProgramBrowser programs={programs} categories={categories} />
              : <ContentNotice message="No programs are currently available." />}
          {categoriesError && <ContentNotice message={`Program categories could not be loaded: ${categoriesError}`} error />}
        </div>
      </section>
      <section className="manifesto">
        <div className="shell manifesto__inner"><p className="eyebrow">Not sure where to start?</p><div><h2>We’ll figure out the right first step together.</h2><p className="manifesto__text">Request a consultation and tell us what you’re looking for. No pressure—just a chance to talk through your goals and questions.</p><Button href="/book-consultation" variant="outline">Request a consultation <ArrowUpRight size={16} /></Button></div></div>
      </section>
    </>
  );
}
