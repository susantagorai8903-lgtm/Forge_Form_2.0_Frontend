import { apiRequest, ApiError, type ApiRequestInit } from "./client";
import { endpoints } from "./endpoints";
import type {
  Article,
  BlogCategory,
  Location,
  Program,
  ProgramCategory,
  Testimonial,
  Trainer,
} from "../types";

const publicCache: ApiRequestInit = { next: { revalidate: 300 } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string") throw new ApiError(`The API returned invalid content (${field}).`, 502);
  return value;
}

function optionalId(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return requireString(value, "id");
}

function requireStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new ApiError(`The API returned invalid content (${field}).`, 502);
  }
  return value;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new ApiError(`The API returned an invalid ${label}.`, 502);
  return value;
}

function parseProgram(value: unknown): Program {
  const row = requireRecord(value, "program");
  return {
    id: optionalId(row.id),
    slug: requireString(row.slug, "slug"),
    title: requireString(row.title, "title"),
    eyebrow: requireString(row.eyebrow, "eyebrow"),
    summary: requireString(row.summary, "summary"),
    description: requireString(row.description, "description"),
    image: requireString(row.image, "image"),
    alt: requireString(row.alt, "alt"),
    benefits: requireStringArray(row.benefits, "benefits"),
    suitableFor: requireString(row.suitableFor, "suitableFor"),
  };
}

function parseTrainer(value: unknown): Trainer {
  const row = requireRecord(value, "trainer");
  return {
    id: optionalId(row.id),
    slug: requireString(row.slug, "slug"),
    name: requireString(row.name, "name"),
    title: requireString(row.title, "title"),
    image: requireString(row.image, "image"),
    alt: requireString(row.alt, "alt"),
    bio: requireString(row.bio, "bio"),
    specialties: requireStringArray(row.specialties, "specialties"),
    experience: requireString(row.experience, "experience"),
  };
}

function parseArticle(value: unknown): Article {
  const row = requireRecord(value, "article");
  return {
    id: optionalId(row.id),
    slug: requireString(row.slug, "slug"),
    title: requireString(row.title, "title"),
    category: requireString(row.category, "category"),
    excerpt: requireString(row.excerpt, "excerpt"),
    content: requireStringArray(row.content, "content"),
    image: requireString(row.image, "image"),
    alt: requireString(row.alt, "alt"),
    author: requireString(row.author, "author"),
    date: requireString(row.date, "date"),
    readingTime: requireString(row.readingTime, "readingTime"),
  };
}

function parseTestimonial(value: unknown): Testimonial {
  const row = requireRecord(value, "testimonial");
  return {
    id: optionalId(row.id),
    name: requireString(row.name, "name"),
    quote: requireString(row.quote, "quote"),
    image: requireString(row.image, "image"),
  };
}

function parseCategory(value: unknown, label: string): ProgramCategory {
  const row = requireRecord(value, label);
  return {
    id: requireString(row.id, "id"),
    name: requireString(row.name, "name"),
    slug: requireString(row.slug, "slug"),
  };
}

function parseLocation(value: unknown): Location {
  const row = requireRecord(value, "location");
  if (row.latitude !== null && typeof row.latitude !== "number") {
    throw new ApiError("The API returned invalid content (latitude).", 502);
  }
  if (row.longitude !== null && typeof row.longitude !== "number") {
    throw new ApiError("The API returned invalid content (longitude).", 502);
  }
  if (row.opening_hours !== null && !isRecord(row.opening_hours)) {
    throw new ApiError("The API returned invalid content (opening_hours).", 502);
  }
  return {
    id: requireString(row.id, "id"),
    name: requireString(row.name, "name"),
    address: requireString(row.address, "address"),
    city: requireString(row.city, "city"),
    state: requireString(row.state, "state"),
    postal_code: requireString(row.postal_code, "postal_code"),
    country: requireString(row.country, "country"),
    phone: requireString(row.phone, "phone"),
    email: requireString(row.email, "email"),
    latitude: row.latitude,
    longitude: row.longitude,
    opening_hours: row.opening_hours as Record<string, string> | null,
  };
}

async function getArray<T>(path: string, label: string, parse: (value: unknown) => T): Promise<T[]> {
  const result = await apiRequest<unknown>(path, publicCache);
  if (!Array.isArray(result)) throw new ApiError(`The API returned an invalid ${label} list.`, 502);
  return result.map(parse);
}

async function getItem<T>(path: string, label: string, parse: (value: unknown) => T): Promise<T> {
  return parse(await apiRequest<unknown>(path, publicCache));
}

export function getPrograms() {
  return getArray(endpoints.programs, "program", parseProgram);
}

export function getProgram(slug: string) {
  return getItem(`${endpoints.programs}/${encodeURIComponent(slug)}`, "program", parseProgram);
}

export function getProgramCategories() {
  return getArray(endpoints.programCategories, "program category", (value) => parseCategory(value, "program category"));
}

export function getTrainers() {
  return getArray(endpoints.trainers, "trainer", parseTrainer);
}

export function getTrainer(slug: string) {
  return getItem(`${endpoints.trainers}/${encodeURIComponent(slug)}`, "trainer", parseTrainer);
}

export function getTestimonials() {
  return getArray(endpoints.testimonials, "testimonial", parseTestimonial);
}

export function getArticles() {
  return getArray(endpoints.blog, "article", parseArticle);
}

export function getArticle(slug: string) {
  return getItem(`${endpoints.blog}/${encodeURIComponent(slug)}`, "article", parseArticle);
}

export function getBlogCategories(): Promise<BlogCategory[]> {
  return getArray(endpoints.blogCategories, "blog category", (value) => parseCategory(value, "blog category"));
}

export function getLocations() {
  return getArray(endpoints.locations, "location", parseLocation);
}

export async function loadContent<T>(request: Promise<T[]>): Promise<{ items: T[]; error?: string }> {
  try {
    return { items: await request };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return { items: [], error: error.message };
  }
}
