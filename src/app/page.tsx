import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin, MoveRight } from "lucide-react";
import { getLocations, getPrograms, getTestimonials, getTrainers, loadContent } from "@/services/content.service";
import { Button } from "@/components/shared/Button";
import { FinalCta } from "@/components/shared/FinalCta";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrainerCard } from "@/components/shared/TrainerCard";
import { Reveal } from "@/components/shared/Reveal";
import { Journey } from "@/components/home/Journey";
import { Gallery } from "@/components/home/Gallery";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { ContentImage } from "@/components/shared/ContentImage";

export const revalidate = 300;

export default async function HomePage() {
  const [programResult, trainerResult, testimonialResult, locationResult] = await Promise.all([
    loadContent(getPrograms()),
    loadContent(getTrainers()),
    loadContent(getTestimonials()),
    loadContent(getLocations()),
  ]);
  const programs = programResult.items;
  const trainers = trainerResult.items;
  const testimonials = testimonialResult.items;
  const location = locationResult.items[0];

  return (
    <>
      <section className="home-hero">
        <Image src="/images/a3.jpg" alt="The Forge & Form community training together" fill priority sizes="100vw" className="cover-image home-hero__photo" />
        <div className="home-hero__scrim" />
        <div className="home-hero__content shell">
          {/* <p className="eyebrow eyebrow--lime"><span className="status-dot" /> Personal training · Portland, Oregon</p> */}
          <h1>Build strength.<br /><span>Shape your future.</span></h1>
          {/**<p className="home-hero__copy">Personalized training. Expert coaching. Sustainable results. Discover a stronger, healthier version of yourself with Forge & Form.</p> */}
          <div className="home-hero__actions">
            <Button href="/book-consultation">Start your journey <ArrowUpRight size={17} /></Button>
            <Link href="/programs" className="button button--ghost">Explore programs <MoveRight size={17} /></Link>
          </div>
          <div className="home-hero__foot">
            <span>01 — YOUR NEXT CHAPTER</span>
            <span>SCROLL TO EXPLORE <ArrowDown size={14} /></span>
          </div>
        </div>
      </section>

      <section className="intro-section section-light">
        <div className="shell intro-section__grid">
          <Reveal className="intro-section__visual">
            <div className="intro-section__image">
              <Image src="/images/b2.jpeg" alt="A calm, intentional movement practice" fill sizes="(max-width: 800px) 90vw, 42vw" className="cover-image" />
            </div>
            <span className="image-label">01 / MOVEMENT WITH INTENTION</span>
          </Reveal>
          <Reveal className="intro-section__text" delay={0.12}>
            <p className="eyebrow">Stronger by design</p>
            <h2>Training that<br />meets you <em>where you are.</em></h2>
            <p>Getting stronger isn’t a one-size-fits-all pursuit. We bring thoughtful coaching, purposeful movement, and a welcoming space together to help you build a practice that feels like yours.</p>
            <p>Start with a conversation. We’ll take it one step at a time.</p>
            <Link className="text-link" href="/about">Get to know our approach <MoveRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <Journey />

      <section className="programs-section section-light">
        <div className="shell">
          <div className="section-topline">
            <SectionHeading eyebrow="Find your focus" title="Training with purpose." />
            <Link className="text-link" href="/programs">Explore all programs <MoveRight size={16} /></Link>
          </div>
          {programResult.error
            ? <ContentNotice message={`Programs could not be loaded: ${programResult.error}`} error />
            : programs.length
              ? <div className="program-grid">{programs.map((program, index) => <Reveal key={program.slug} delay={index * 0.06}><ProgramCard program={program} index={index} /></Reveal>)}</div>
              : <ContentNotice message="No programs are currently available." />}
        </div>
      </section>

      <section className="values-section section-paper">
        <div className="shell values-section__grid">
          <div className="values-section__heading">
            <SectionHeading eyebrow="The Forge & Form difference" title="More than a workout. A better way forward." />
            <p>We believe the best training is the training that works for you—today, next week, and for the long run.</p>
            <Button href="/about" variant="outline">Our approach <ArrowUpRight size={16} /></Button>
          </div>
          <div className="values-list">
            {[
              ["01", "Coaching that listens", "Your starting point, goals, and schedule shape the plan."],
              ["02", "Progress with purpose", "Clear, meaningful milestones help you see the work adding up."],
              ["03", "A place to belong", "Encouragement and accountability without the pressure to be perfect."],
              ["04", "Wellness for real life", "Sustainable movement and habits that make room for the rest of you."],
            ].map(([number, title, copy]) => <article className="value-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><ArrowUpRight size={17} aria-hidden="true" /></article>)}
          </div>
        </div>
      </section>

      <Gallery />

      <section className="trainers-section section-light">
        <div className="shell">
          <div className="section-topline">
            <SectionHeading eyebrow="Good people, thoughtful coaching" title="Meet your coaches." />
            <Link className="text-link" href="/trainers">Meet the team <MoveRight size={16} /></Link>
          </div>
          {trainerResult.error
            ? <ContentNotice message={`Trainers could not be loaded: ${trainerResult.error}`} error />
            : trainers.length
              ? <div className="trainer-grid">{trainers.map((trainer, index) => <Reveal key={trainer.id ?? trainer.slug} delay={index * 0.08}><TrainerCard trainer={trainer} index={index} /></Reveal>)}</div>
              : <ContentNotice message="No trainer profiles are currently available." />}
        </div>
      </section>

      <section className="stories-section section-dark">
        <div className="shell">
          <div className="section-topline section-topline--light">
            <SectionHeading eyebrow="Stories in progress" title="Every journey is personal." light />
            <Link className="text-link text-link--light" href="/testimonials">Explore client stories <MoveRight size={16} /></Link>
          </div>
          {testimonialResult.error
            ? <ContentNotice message={`Client stories could not be loaded: ${testimonialResult.error}`} error />
            : testimonials.length
              ? <div className="story-grid">{testimonials.slice(0, 3).map((story, index) => (
            <article className="story-card" key={story.name}>
              <div className="story-card__image"><ContentImage src={story.image} alt={`Photo shared by ${story.name}`} sizes="(max-width: 700px) 90vw, 30vw" /></div>
              <div className="story-card__body"><span className="eyebrow eyebrow--lime">CLIENT STORY / {String(index + 1).padStart(2, "0")}</span><blockquote>“{story.quote}”</blockquote><span className="story-card__name">{story.name}</span></div>
            </article>
              ))}</div>
              : <ContentNotice message="No client stories have been published." />}
        </div>
      </section>

      <FinalCta />

      <section className="contact-strip section-light">
        <div className="shell contact-strip__inner">
          <div><p className="eyebrow">Come say hello</p><h2>A good place to begin<br />is a conversation.</h2></div>
          <div className="contact-strip__details">
            {location ? <>
              <p><MapPin size={17} /><span>{location.address}<br />{location.city}, {location.state} {location.postal_code}</span></p>
              {location.phone && <a href={`tel:${location.phone}`}>{location.phone} <ArrowUpRight size={14} /></a>}
              {location.email && <a href={`mailto:${location.email}`}>{location.email} <ArrowUpRight size={14} /></a>}
            </> : <ContentNotice message={locationResult.error ? `Studio details could not be loaded: ${locationResult.error}` : "Studio contact details are not currently published."} error={Boolean(locationResult.error)} />}
            <Link href="/locations" className="text-link">Get directions <MoveRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
