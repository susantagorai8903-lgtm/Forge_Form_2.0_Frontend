import { SectionHeading } from "@/components/shared/SectionHeading";

type Faq = {
  question: string;
  answer: string;
};

export function FaqSection({ title, faqs }: { title: string; faqs: Faq[] }) {
  return (
    <section className="content-section section-paper faq-section" aria-label={title}>
      <div className="shell">
        <SectionHeading eyebrow="Good to know" title={title} />
        <p className="demo-note">Sample FAQ copy—confirm studio policies and parking guidance before publication.</p>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
