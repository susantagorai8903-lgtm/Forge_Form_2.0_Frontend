import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { FinalCta } from "@/components/shared/FinalCta";
import { ContentImage } from "@/components/shared/ContentImage";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { getArticle } from "@/services/content.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [{ url: article.image, alt: article.alt }],
      },
    };
  } catch (error) {
    if (error instanceof ApiError) return {};
    throw error;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticle(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError) return <section className="content-section section-light"><div className="shell"><ContentNotice message={`Article could not be loaded: ${error.message}`} error /></div></section>;
    throw error;
  }

  return (
    <>
      <article className="content-section section-light">
        <div className="shell article-body">
          <Link className="text-link" href="/blog"><ArrowLeft size={14} /> Back to the journal</Link>
          <p className="article-body__meta" style={{ marginTop: 32 }}>{[article.category, article.readingTime, article.author, article.date].filter(Boolean).join(" · ")}</p>
          <h1>{article.title}</h1>
          {article.isSample && <p className="demo-note">Sample editorial content for preview—review and approve before publication.</p>}
          <p className="section-heading__copy">{article.excerpt}</p>
          {article.image && <div className="article-body__image"><ContentImage src={article.image} alt={article.alt} priority sizes="(max-width: 800px) 90vw, 760px" /></div>}
          {article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="field__hint">This article is general information, not medical or individualized nutrition advice.</p>
        </div>
      </article>
      <FinalCta />
    </>
  );
}
