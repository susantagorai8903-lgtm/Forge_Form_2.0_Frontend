import {
  getArticle as fetchArticle,
  getArticles as fetchArticles,
  getBlogCategories as fetchBlogCategories,
  getLocations as fetchLocations,
  getProgram as fetchProgram,
  getProgramCategories as fetchProgramCategories,
  getPrograms as fetchPrograms,
  getTrainer as fetchTrainer,
  getTrainers as fetchTrainers,
  getTestimonials as fetchTestimonials,
  loadContent,
} from "@forge-form/shared/content";
import type { Article, BlogCategory, Location, Program, ProgramCategory, Testimonial, Trainer } from "@/types/content";
import { ApiError } from "@/lib/api/client";
import { programs as fallbackPrograms } from "@/data/programs";
import { mockArticles, mockLocation, mockTestimonials, mockTrainers } from "@/data/mockData";

async function listWithFallback<T>(
  label: string,
  request: () => Promise<T[]>,
  fallback: T[],
): Promise<T[]> {
  try {
    const items = await request();
    if (items.length) return items;
    console.warn(`[Forge & Form] ${label} API returned no items; using clearly labeled sample content.`);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    console.warn(`[Forge & Form] ${label} API unavailable (${error.message}); using clearly labeled sample content.`);
  }
  return fallback;
}

async function itemWithFallback<T>(
  label: string,
  slug: string,
  request: () => Promise<T>,
  fallback: T | undefined,
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (!fallback) throw error;
    console.warn(`[Forge & Form] ${label} API unavailable for "${slug}" (${error.message}); using sample content.`);
    return fallback;
  }
}

function categoriesFromNames(names: string[]): ProgramCategory[] {
  return Array.from(new Set(names)).map((name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { id: slug, name, slug };
  });
}

export function getPrograms(): Promise<Program[]> {
  return listWithFallback("Programs", fetchPrograms, fallbackPrograms);
}

export function getProgram(slug: string): Promise<Program> {
  return itemWithFallback("Program", slug, () => fetchProgram(slug), fallbackPrograms.find((item) => item.slug === slug));
}

export async function getProgramCategories(): Promise<ProgramCategory[]> {
  const programs = await getPrograms();
  const categories = categoriesFromNames(programs.map((program) => program.eyebrow));
  return listWithFallback("Program categories", fetchProgramCategories, categories);
}

export function getTrainers(): Promise<Trainer[]> {
  return listWithFallback("Trainers", fetchTrainers, mockTrainers);
}

export function getTrainer(slug: string): Promise<Trainer> {
  return itemWithFallback("Trainer", slug, () => fetchTrainer(slug), mockTrainers.find((item) => item.slug === slug));
}

export function getTestimonials(): Promise<Testimonial[]> {
  return listWithFallback("Client stories", fetchTestimonials, mockTestimonials);
}

export function getArticles(): Promise<Article[]> {
  return listWithFallback("Articles", fetchArticles, mockArticles);
}

export function getArticle(slug: string): Promise<Article> {
  return itemWithFallback("Article", slug, () => fetchArticle(slug), mockArticles.find((item) => item.slug === slug));
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const articles = await getArticles();
  const categories = categoriesFromNames(articles.map((article) => article.category));
  return listWithFallback("Article categories", fetchBlogCategories, categories);
}

export function getLocations(): Promise<Location[]> {
  return listWithFallback("Locations", fetchLocations, [mockLocation]);
}

export { loadContent };
