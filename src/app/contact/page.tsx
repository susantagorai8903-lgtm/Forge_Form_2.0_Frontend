import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { getLocations, loadContent } from "@/services/content.service";
import { ContentNotice } from "@/components/shared/ContentNotice";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Forge & Form Personal Training in Portland, Oregon.",
};

const questions = [
  ["What happens during a consultation?", "It is a chance to share what you are looking for and discuss possible next steps with the studio."],
  ["Do I need training experience?", "No. We welcome people at different experience levels. Your coach will learn about your starting point and help you explore an appropriate next step."],
  ["Can I ask about a specific program?", "Absolutely. Choose a program in the form or mention your questions in the message, and the studio can follow up."],
];

export const revalidate = 300;

export default async function ContactPage() {
  const locationResult = await loadContent(getLocations());
  const location = locationResult.items[0];
  return (
    <>
      <PageHero eyebrow="Start with a conversation" title="Let’s talk." description="Questions about training, the studio, or where to begin? Send us a note and we’ll help you find the right next step." image="/images/a4.jpg" imageAlt="A trainer consulting with a prospective client" action={false} />
      <section className="content-section section-light">
        <div className="shell contact-layout">
          <aside className="contact-info">
            <p className="eyebrow">We’re here to help</p><h2>Make the first move.</h2><p>Tell us a little about what you’re looking for. Our team will follow up using your preferred contact method.</p>
            <div className="contact-info__list">
                {location?.phone && <div className="contact-info__item"><Phone size={17} /><span><small>Call the studio</small><a href={`tel:${location.phone}`}>{location.phone}</a></span></div>}
                {location?.email && <div className="contact-info__item"><Mail size={17} /><span><small>Email</small><a href={`mailto:${location.email}`}>{location.email}</a></span></div>}
                {location && <div className="contact-info__item"><MapPin size={17} /><span><small>Visit</small>{location.address}<br />{location.city}, {location.state} {location.postal_code}</span></div>}
                {!location && <ContentNotice message={locationResult.error ? `Studio contact details could not be loaded: ${locationResult.error}` : "Studio contact details are not currently published."} error={Boolean(locationResult.error)} />}
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
      <section className="content-section section-paper">
        <div className="shell"><p className="eyebrow">A few quick answers</p><h2 className="page-section-title">Before you reach out.</h2><div className="faq-list" style={{ marginTop: 30 }}>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div>
      </section>
    </>
  );
}
