/*
  # Media Management System Schema

  1. New Tables
    - `media_categories`
      - Organizes media files into categories
    - `media_tags`
      - Allows tagging media files for better organization
    - `media_files`
      - Stores information about uploaded media files
      - Includes metadata like filename, type, size, etc.
    - `media_files_tags`
      - Junction table for many-to-many relationship between files and tags

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own media
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
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for media_categories
CREATE POLICY "Users can manage their own categories"
  ON media_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for media_tags
CREATE POLICY "Users can manage their own tags"
  ON media_tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for media_files
CREATE POLICY "Users can manage their own media files"
  ON media_files
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for media_files_tags
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
CREATE TRIGGER update_media_categories_updated_at
  BEFORE UPDATE ON media_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();