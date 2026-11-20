import type { Metadata } from "next";
import { ApiError } from "@/lib/api/client";
import { PageHero } from "@/components/shared/PageHero";
import { BlogBrowser } from "@/components/blog/BlogBrowser";
import { ContentNotice } from "@/components/shared/ContentNotice";
import { getArticles, getBlogCategories } from "@/services/content.service";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Explore articles published by Forge & Form.",
  openGraph: {
    title: "The Journal | Forge & Form",
    description: "Read ideas and practical guidance on strength, mobility, nutrition, and mindset.",
    images: [{ url: "/images/a3.jpg", width: 1200, height: 800, alt: "The Forge & Form training community" }],
  },
};

export const revalidate = 300;

export default async function BlogPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  let categories: Awaited<ReturnType<typeof getBlogCategories>> = [];
  let articlesError = "";
  let categoriesError = "";
  try {
    articles = await getArticles();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    articlesError = error.message;
  }
  try {
    categories = await getBlogCategories();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    categoriesError = error.message;
  }

  return (
    <>
      <PageHero eyebrow="Notes for a life in motion" title="The journal." description="Ideas and practical starting points for strength, mobility, nutrition, and a more considered approach to wellness." image="/images/h10.jpeg" imageAlt="Group fitness training with people moving together" imagePosition="center 25%" action={false} />
      <section className="content-section section-light">
        <div className="shell">
          <div className="content-section__intro"><p className="eyebrow">From the journal</p><h2 className="page-section-title">A little more perspective.</h2><p>Articles are informational and not medical advice.</p></div>
          {articlesError
            ? <ContentNotice message={`Articles could not be loaded: ${articlesError}`} error />
            : articles.length
              ? <>{articles.some((article) => article.isSample) && <p className="demo-note">Sample editorial content for preview—review and approve before publication.</p>}<BlogBrowser articles={articles} categories={categories} /></>
              : <ContentNotice message="No articles have been published." />}
          {categoriesError && <ContentNotice message={`Article categories could not be loaded: ${categoriesError}`} error />}
        </div>
      </section>
    </>
  );
}
