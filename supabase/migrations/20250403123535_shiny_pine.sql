/*
  # CMS System Schema Setup

  1. New Tables
    - `articles`
      - Store blog posts and articles
      - Support drafts and publishing
      - Track versions and authors
    - `static_pages`
      - Store static website pages
      - Support versioning and slugs
    - `menu_items`
      - Manage website navigation
      - Support nested menus
    - `article_versions`
      - Track article revision history
    - `page_versions`
      - Track page revision history

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Secure content management

  3. Relationships
    - Link content to media files
    - Track content ownership
    - Manage menu hierarchy
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  slug text UNIQUE NOT NULL,
  featured_image uuid REFERENCES media_files(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  seo_title text,
  seo_description text,
  seo_keywords text[]
);

-- Create article versions table
CREATE TABLE IF NOT EXISTS article_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  version_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create static pages table
CREATE TABLE IF NOT EXISTS static_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  slug text UNIQUE NOT NULL,
  featured_image uuid REFERENCES media_files(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  seo_title text,
  seo_description text,
  seo_keywords text[]
);

-- Create page versions table
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES static_pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  version_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  order_index integer DEFAULT 0,
  parent_id uuid REFERENCES menu_items(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_static_pages_user_id ON static_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_static_pages_slug ON static_pages(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items(order_index);

-- Create policies for articles
CREATE POLICY "Anyone can read published articles"
  ON articles
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authors can manage their own articles"
  ON articles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for article versions
CREATE POLICY "Authors can manage their article versions"
  ON article_versions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for static pages
CREATE POLICY "Anyone can read published pages"
  ON static_pages
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authors can manage their own pages"
  ON static_pages
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for page versions
CREATE POLICY "Authors can manage their page versions"
  ON page_versions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for menu items
CREATE POLICY "Anyone can read active menu items"
  ON menu_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authors can manage menu items"
  ON menu_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create functions for versioning
CREATE OR REPLACE FUNCTION create_article_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO article_versions (
    article_id,
    title,
    content,
    excerpt,
    version_number,
    user_id
  ) VALUES (
    OLD.id,
    OLD.title,
    OLD.content,
    OLD.excerpt,
    COALESCE((
      SELECT MAX(version_number) + 1
      FROM article_versions
      WHERE article_id = OLD.id
    ), 1),
    OLD.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO page_versions (
    page_id,
    title,
    content,
    version_number,
    user_id
  ) VALUES (
    OLD.id,
    OLD.title,
    OLD.content,
    COALESCE((
      SELECT MAX(version_number) + 1
      FROM page_versions
      WHERE page_id = OLD.id
    ), 1),
    OLD.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for versioning
CREATE TRIGGER article_version_trigger
  BEFORE UPDATE OF title, content, excerpt
  ON articles
  FOR EACH ROW
  EXECUTE FUNCTION create_article_version();

CREATE TRIGGER page_version_trigger
  BEFORE UPDATE OF title, content
  ON static_pages
  FOR EACH ROW
  EXECUTE FUNCTION create_page_version();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_static_pages_updated_at
  BEFORE UPDATE ON static_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();