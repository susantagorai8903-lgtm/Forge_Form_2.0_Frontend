import type { MetadataRoute } from "next";
import { getArticles, getPrograms, getTrainers, loadContent } from "@/services/content.service";

const routes = [
  "", "/about", "/programs", "/trainers",
  "/testimonials", "/locations", "/blog", "/contact", "/book-consultation", "/privacy-policy", "/terms",
];

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programResult, articleResult, trainerResult] = await Promise.all([
    loadContent(getPrograms()),
    loadContent(getArticles()),
    loadContent(getTrainers()),
  ]);
  const allRoutes = [
    ...routes,
    ...programResult.items.map((program) => `/programs/${program.slug}`),
    ...articleResult.items.map((article) => `/blog/${article.slug}`),
    ...trainerResult.items.map((trainer) => `/trainers/${trainer.slug}`),
  ];
  return allRoutes.map((route) => ({
    url: `https://forgeandform.com${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
