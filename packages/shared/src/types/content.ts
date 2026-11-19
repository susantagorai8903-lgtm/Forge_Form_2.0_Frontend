export type Program = {
  id?: string;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  heroImage?: string;
  heroImagePosition?: string;
  alt: string;
  benefits: string[];
  suitableFor: string;
};

export type ProgramCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Trainer = {
  id?: string;
  slug: string;
  name: string;
  title: string;
  image: string;
  alt: string;
  bio: string;
  specialties: string[];
  experience: string;
};

export type Article = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  image: string;
  alt: string;
  author: string;
  date: string;
  readingTime: string;
};

export type BlogCategory = ProgramCategory;

export type Testimonial = {
  id?: string;
  name: string;
  quote: string;
  image: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  opening_hours: Record<string, string> | null;
};
