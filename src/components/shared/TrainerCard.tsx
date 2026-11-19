import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Trainer } from "@/types/content";
import { ContentImage } from "@/components/shared/ContentImage";

export function TrainerCard({ trainer, index = 0 }: { trainer: Trainer; index?: number }) {
  return (
    <article className="trainer-card">
      <div className="trainer-card__image">
        <ContentImage src={trainer.image} alt={trainer.alt} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" />
        <span className="trainer-card__number">COACH / 0{index + 1}</span>
      </div>
      <div className="trainer-card__details">
        <div><h3>{trainer.name}</h3><span>{trainer.title}</span></div>
        <Link href={`/trainers/${trainer.slug}`} aria-label={`Read more about ${trainer.name}`}><ArrowUpRight size={18} /></Link>
      </div>
      <p className="trainer-card__experience">{trainer.experience}</p>
      <p className="trainer-card__demo">{trainer.bio}</p>
      <ul className="trainer-card__specialties">{trainer.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}</ul>
    </article>
  );
}
