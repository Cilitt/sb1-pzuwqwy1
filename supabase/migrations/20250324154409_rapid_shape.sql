/*
  # Media Management System Schema Update

  1. Changes
    - Add safety checks for existing policies
    - Ensure tables are created in correct order
    - Maintain all existing functionality

  2. Security
    - Maintain RLS on all tables
    - Update policies with IF NOT EXISTS
*/

-- Create media_categories table first (since it's referenced by media_files)
CREATE TABLE IF NOT EXISTS media_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create media_tags table (referenced by media_files_tags)
CREATE TABLE IF NOT EXISTS media_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  size integer NOT NULL,
  path text NOT NULL,
  category_id uuid REFERENCES media_categories(id),
  title text,
  description text,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create junction table for media files and tags
CREATE TABLE IF NOT EXISTS media_files_tags (
  file_id uuid REFERENCES media_files(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES media_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (file_id, tag_id)
);

-- Enable Row Level Security
DO $$ 
BEGIN
  ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE media_tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
  ALTER TABLE media_files_tags ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies for media_categories
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own categories" ON media_categories;
  CREATE POLICY "Users can manage their own categories"
    ON media_categories
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies for media_tags
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own tags" ON media_tags;
  CREATE POLICY "Users can manage their own tags"
    ON media_tags
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies for media_files
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own media files" ON media_files;
  CREATE POLICY "Users can manage their own media files"
    ON media_files
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies for media_files_tags
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own file tags" ON media_files_tags;
  CREATE POLICY "Users can manage their own file tags"
    ON media_files_tags
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM media_files
        WHERE id = file_id AND user_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM media_files
        WHERE id = file_id AND user_id = auth.uid()
      )
    );
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_categories_user_id ON media_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_media_tags_user_id ON media_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_category_id ON media_files(category_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS update_media_categories_updated_at ON media_categories;
  CREATE TRIGGER update_media_categories_updated_at
    BEFORE UPDATE ON media_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
  CREATE TRIGGER update_media_files_updated_at
    BEFORE UPDATE ON media_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION 
  WHEN others THEN NULL;
END $$;