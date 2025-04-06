/*
  # Initial Content Migration with Auth Setup

  1. Changes
    - Enable pgcrypto extension
    - Create admin user with secure function
    - Insert initial services and portfolio data
    - Use correct column names for all tables
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin user function to handle the auth user creation
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS UUID AS $$
DECLARE
  admin_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Insert admin user if it doesn't exist
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    confirmation_token,
    recovery_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    '',
    ''
  ) ON CONFLICT (id) DO NOTHING;

  RETURN admin_id;
END;
$$ LANGUAGE plpgsql;

-- Main migration block
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  admin_user_id := create_admin_user();

  -- Insert services
  INSERT INTO services (title, description, icon, order_index, user_id)
  VALUES
    (
      'Responsywny Design',
      'Strony internetowe dostosowane do wszystkich urządzeń, z nowoczesnym interfejsem użytkownika.',
      'Palette',
      0,
      admin_user_id
    ),
    (
      'Web Development',
      'Tworzenie wydajnych aplikacji internetowych z wykorzystaniem najnowszych technologii.',
      'Code',
      1,
      admin_user_id
    ),
    (
      'Optymalizacja SEO',
      'Kompleksowa optymalizacja dla wyszukiwarek, zwiększająca widoczność Twojej strony.',
      'Database',
      2,
      admin_user_id
    ),
    (
      'Sklepy Internetowe',
      'Profesjonalne platformy e-commerce z intuicyjnym systemem zarządzania.',
      'ShoppingCart',
      3,
      admin_user_id
    ),
    (
      'Systemy CMS',
      'Łatwe w obsłudze systemy zarządzania treścią, dostosowane do Twoich potrzeb.',
      'Terminal',
      4,
      admin_user_id
    ),
    (
      'Wsparcie Techniczne',
      'Profesjonalne doradztwo i stałe wsparcie techniczne dla Twojej strony.',
      'Users',
      5,
      admin_user_id
    );

  -- Insert portfolio items
  INSERT INTO portfolio (title, description, imageUrl, "order", user_id)
  VALUES
    (
      'Platforma E-commerce',
      'Nowoczesny sklep internetowy',
      'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800',
      0,
      admin_user_id
    ),
    (
      'Strona Korporacyjna',
      'Profesjonalna obecność w sieci',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800',
      1,
      admin_user_id
    ),
    (
      'Aplikacja Mobilna',
      'Aplikacja na iOS i Android',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800',
      2,
      admin_user_id
    ),
    (
      'Panel Analityczny',
      'Platforma wizualizacji danych',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800',
      3,
      admin_user_id
    ),
    (
      'Sieć Społecznościowa',
      'Platforma dla społeczności',
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800',
      4,
      admin_user_id
    ),
    (
      'Platforma Edukacyjna',
      'System zarządzania nauczaniem',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800',
      5,
      admin_user_id
    );

EXCEPTION WHEN others THEN
  -- Log the error and re-raise
  RAISE NOTICE 'Error inserting initial content: %', SQLERRM;
  RAISE;
END $$;

-- Clean up the temporary function
DROP FUNCTION IF EXISTS create_admin_user();