export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface ArticleVersion {
  id: string;
  articleId: string;
  title: string;
  content: string;
  excerpt?: string;
  versionNumber: number;
  createdAt: Date;
  userId: string;
}

export interface StaticPage {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface PageVersion {
  id: string;
  pageId: string;
  title: string;
  content: string;
  versionNumber: number;
  createdAt: Date;
  userId: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  orderIndex: number;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}