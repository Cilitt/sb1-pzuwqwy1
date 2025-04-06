import fs from 'fs/promises';
import path from 'path';

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  tier: string;
  price: string;
  features: string[];
}

interface ProjectCard {
  image: string;
  title: string;
  description: string;
}

async function extractData() {
  try {
    // Read App.tsx content
    const appContent = await fs.readFile(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');

    // Extract services data
    const services: Service[] = [
      {
        icon: 'Palette',
        title: 'Responsywny Design',
        description: 'Strony internetowe dostosowane do wszystkich urządzeń, z nowoczesnym interfejsem użytkownika.'
      },
      {
        icon: 'Code',
        title: 'Web Development',
        description: 'Tworzenie wydajnych aplikacji internetowych z wykorzystaniem najnowszych technologii.'
      },
      {
        icon: 'Database',
        title: 'Optymalizacja SEO',
        description: 'Kompleksowa optymalizacja dla wyszukiwarek, zwiększająca widoczność Twojej strony.'
      },
      {
        icon: 'ShoppingCart',
        title: 'Sklepy Internetowe',
        description: 'Profesjonalne platformy e-commerce z intuicyjnym systemem zarządzania.'
      },
      {
        icon: 'Terminal',
        title: 'Systemy CMS',
        description: 'Łatwe w obsłudze systemy zarządzania treścią, dostosowane do Twoich potrzeb.'
      },
      {
        icon: 'Users',
        title: 'Wsparcie Techniczne',
        description: 'Profesjonalne doradztwo i stałe wsparcie techniczne dla Twojej strony.'
      }
    ];

    // Extract pricing data
    const pricingTiers: PricingTier[] = [
      {
        tier: 'Basic',
        price: '3999 zł',
        features: [
          '5 Podstron',
          'Responsywny Design',
          'Podstawowe SEO',
          'Formularz Kontaktowy',
          '1 Miesiąc Wsparcia'
        ]
      },
      {
        tier: 'Standard',
        price: '9999 zł',
        features: [
          '10 Podstron',
          'Zaawansowany Design',
          'Pełny Pakiet SEO',
          'Integracja CMS',
          '3 Miesiące Wsparcia'
        ]
      },
      {
        tier: 'Premium',
        price: '19999 zł',
        features: [
          'Nielimitowane Podstrony',
          'Funkcje na Zamówienie',
          'Sklep Internetowy',
          'Zaawansowana Analityka',
          '12 Miesięcy Wsparcia'
        ]
      }
    ];

    // Extract portfolio projects data
    const projects: ProjectCard[] = [
      {
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800',
        title: 'Platforma E-commerce',
        description: 'Nowoczesny sklep internetowy'
      },
      {
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800',
        title: 'Strona Korporacyjna',
        description: 'Profesjonalna obecność w sieci'
      },
      {
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800',
        title: 'Aplikacja Mobilna',
        description: 'Aplikacja na iOS i Android'
      },
      {
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800',
        title: 'Panel Analityczny',
        description: 'Platforma wizualizacji danych'
      },
      {
        image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800',
        title: 'Sieć Społecznościowa',
        description: 'Platforma dla społeczności'
      },
      {
        image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800',
        title: 'Platforma Edukacyjna',
        description: 'System zarządzania nauczaniem'
      }
    ];

    // Generate SQL for services
    const servicesSQL = services.map((service, index) => `
INSERT INTO services (title, description, icon, order_index)
VALUES (
  '${service.title}',
  '${service.description}',
  '${service.icon}',
  ${index}
);`).join('\n');

    // Generate SQL for pricing tiers
    const pricingSQL = pricingTiers.map((tier, index) => `
INSERT INTO pricing_tiers (tier, price, features, order_index)
VALUES (
  '${tier.tier}',
  '${tier.price}',
  ARRAY[${tier.features.map(f => `'${f}'`).join(', ')}],
  ${index}
);`).join('\n');

    // Generate SQL for portfolio projects
    const projectsSQL = projects.map((project, index) => `
INSERT INTO portfolio (title, description, imageUrl, order_index)
VALUES (
  '${project.title}',
  '${project.description}',
  '${project.image}',
  ${index}
);`).join('\n');

    // Generate complete SQL file
    const sql = `-- Services
${servicesSQL}

-- Pricing Tiers
${pricingSQL}

-- Portfolio Projects
${projectsSQL}
`;

    // Write SQL to file
    await fs.writeFile(path.join(process.cwd(), 'scripts', 'extracted_data.sql'), sql);
    console.log('Data extracted and SQL generated successfully!');

  } catch (error) {
    console.error('Error extracting data:', error);
  }
}

extractData();