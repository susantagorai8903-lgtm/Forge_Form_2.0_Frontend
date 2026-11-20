import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { FaqSection } from "@/components/shared/FaqSection";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description: "Request a Forge & Form consultation. Choose a program and preferred time for the studio to confirm.",
  openGraph: {
    title: "Book a Training Consultation | Forge & Form",
    description: "Start a conversation about personal training and coaching at Forge & Form in Portland.",
    images: [{ url: "/images/a3.jpg", width: 1200, height: 800, alt: "The Forge & Form training community" }],
  },
};

export default function BookingPage() {
  return (
    <>
      <PageHero eyebrow="Start with a conversation" title="Your first step." description="Tell us what you’re looking for and request a time to connect. We’ll follow up to confirm the details." image="/images/fitness-assessment.jpg" imageAlt="A coach reviewing a fitness assessment with a client" imagePosition="center 20%" action={false} />
      <section className="content-section section-light">
        <div className="shell">
          <BookingWizard />
        </div>
      </section>
      <FaqSection
        title="Before we meet."
        faqs={[
          { question: "What happens at a consultation?", answer: "It’s a chance to talk through what you’d like from training, your experience, and what a realistic routine could look like. You can ask questions and explore next steps—there’s no workout or obligation." },
          { question: "What if I’m a beginner?", answer: "That’s absolutely fine. Coaching can start with the fundamentals, move at a comfortable pace, and adapt as your confidence and experience grow." },
          { question: "Where do I park on Division St?", answer: "We’re at 1900 SE Division Street. Street parking and nearby spaces may be available; restrictions and availability vary, so please check posted signs and give yourself extra time." },
        ]}
      />
    </>
  );
}
