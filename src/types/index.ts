export interface Profile {
  id?: string;
  name: string;
  title: string;
  highlightedName: string;
  eyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  openToWork: boolean;
  profileImageUrl: string;
  aboutImageUrl: string;
  cvUrl: string;
  yearsExperience: string;
  projectsCompleted: string;
  happyClients: string;
  valueIndicators: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  technologies: Array<{
    name: string;
    iconName?: string;
    category?: string;
  }>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  projectImage: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  problem?: string;
  solution?: string;
  features?: string[];
  role?: string;
  results?: string;
  createdAt?: string;
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  profileImage: string;
  testimonialText: string;
  rating: number;
  isFeatured: boolean;
  displayOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  displayOrder: number;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  brandTagline: string;
  siteTitle: string;
  metaDescription: string;
  copyrightText: string;
  socialLinks: SocialLink[];
}
