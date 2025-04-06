import { supabase } from '../lib/supabase';
import { Article, StaticPage, MenuItem, Service } from '../types/cms';

// Articles
export const getArticles = async (includeUnpublished = false): Promise<Article[]> => {
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Article;
};

export const createArticle = async (article: Partial<Article>): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) throw error;
  return data as Article;
};

export const updateArticle = async (id: string, updates: Partial<Article>): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Article;
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Static Pages
export const getPages = async (includeUnpublished = false): Promise<StaticPage[]> => {
  let query = supabase
    .from('static_pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as StaticPage[];
};

export const getPageBySlug = async (slug: string): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as StaticPage;
};

export const createPage = async (page: Partial<StaticPage>): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .insert([page])
    .select()
    .single();

  if (error) throw error;
  return data as StaticPage;
};

export const updatePage = async (id: string, updates: Partial<StaticPage>): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StaticPage;
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('static_pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Menu Items
export const getMenuItems = async (activeOnly = true): Promise<MenuItem[]> => {
  let query = supabase
    .from('menu_items')
    .select('*')
    .order('order_index', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as MenuItem[];
};

export const createMenuItem = async (item: Partial<MenuItem>): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as MenuItem;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as MenuItem;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Services
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Service[];
};

export const createService = async (service: Partial<Service>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data as Service;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Service;
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Version Management
export const getArticleVersions = async (articleId: string) => {
  const { data, error } = await supabase
    .from('article_versions')
    .select('*')
    .eq('article_id', articleId)
    .order('version_number', { ascending: false });

  if (error) throw error;
  return data;
};

export const getPageVersions = async (pageId: string) => {
  const { data, error } = await supabase
    .from('page_versions')
    .select('*')
    .eq('page_id', pageId)
    .order('version_number', { ascending: false });

  if (error) throw error;
  return data;
};

// Publishing
export const publishArticle = async (id: string): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .update({
      is_published: true,
      published_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Article;
};

export const unpublishArticle = async (id: string): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .update({
      is_published: false,
      published_at: null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Article;
};

export const publishPage = async (id: string): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .update({
      is_published: true,
      published_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StaticPage;
};

export const unpublishPage = async (id: string): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .update({
      is_published: false,
      published_at: null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StaticPage;
};