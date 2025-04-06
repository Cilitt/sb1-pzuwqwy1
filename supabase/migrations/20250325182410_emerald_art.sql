/*
  # Authentication and Portfolio Schema Setup

  1. New Tables
    - `portfolio`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `imageUrl` (text)
      - `category` (text)
      - `tags` (text[])
      - `order` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `portfolio` table
    - Add policies for authenticated users to:
      - Read all portfolio items
      - Create/Update/Delete only their own items
*/

-- Create portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  imageUrl text NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view portfolio items"
  ON portfolio
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own portfolio items"
  ON portfolio
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items"
  ON portfolio
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
  ON portfolio
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();