/*
  # Create contact form submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `selected_plan` (text, nullable)
      - `created_at` (timestamp)
      - `status` (text)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users to view their submissions
    - Allow public inserts for form submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  selected_plan text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending',
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
  ON contact_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own submissions"
  ON contact_submissions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);