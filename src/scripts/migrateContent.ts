import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!process.env.VITE_SUPABASE_SERVICE_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_SERVICE_KEY');
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

interface PageContent {
  title: string;
  content: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const websiteContent: PageContent[] = [
  {
    title: "Strona Główna",
    content: `
      <section id="home" class="min-h-screen flex items-center justify-center">
        <div class="text-center max-w-4xl mx-auto px-4">
          <h1 class="text-6xl md:text-7xl font-bold mb-6 text-high-contrast">
            Profesjonalne Tworzenie Stron Internetowych
          </h1>
          <p class="text-2xl md:text-3xl text-medium-contrast mb-8 leading-relaxed">
            Nowoczesne rozwiązania dla Twojego biznesu online
          </p>
        </div>
      </section>
    `,
    slug: "home",
    seoTitle: "Tworzenie Stron Internetowych | Profesjonalne Usługi Web Development",
    seoDescription: "Profesjonalne tworzenie stron internetowych. Responsywne strony, optymalizacja SEO i integracja CMS. Nowoczesne rozwiązania dla Twojego biznesu online.",
    seoKeywords: ["tworzenie stron internetowych", "strony www", "responsywne strony", "SEO", "CMS", "web development"]
  },
  {
    title: "O Nas",
    content: `
      <section id="about" class="py-20 px-4 bg-gray-850/40 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 text-high-contrast">O CLT</h2>
              <p class="text-medium-contrast text-lg leading-relaxed mb-8">
                Z ponad dekadą doświadczenia w tworzeniu stron internetowych, CLT jest liderem w tworzeniu innowacyjnych rozwiązań cyfrowych. Nasza pasja do technologii i designu napędza nas do dostarczania wyjątkowych rezultatów dla naszych klientów.
              </p>
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-4xl font-bold text-primary mb-2">200+</div>
                  <div class="text-medium-contrast text-lg">Zrealizowanych Projektów</div>
                </div>
                <div class="text-center">
                  <div class="text-4xl font-bold text-primary mb-2">98%</div>
                  <div class="text-medium-contrast text-lg">Zadowolonych Klientów</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    slug: "about",
    seoTitle: "O Nas | CLT - Eksperci w Tworzeniu Stron Internetowych",
    seoDescription: "Poznaj CLT - lidera w tworzeniu innowacyjnych rozwiązań cyfrowych. Ponad dekada doświadczenia w tworzeniu stron internetowych.",
    seoKeywords: ["CLT", "o nas", "web development", "doświadczenie", "innowacje"]
  },
  {
    title: "Usługi",
    content: `
      <section id="services" class="py-20 px-4 bg-gray-850/40 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
            Nasze Usługi
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 class="text-xl font-semibold text-high-contrast mb-3">Responsywny Design</h3>
              <p class="text-medium-contrast text-base leading-relaxed">
                Strony internetowe dostosowane do wszystkich urządzeń, z nowoczesnym interfejsem użytkownika.
              </p>
            </div>
            <div class="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 class="text-xl font-semibold text-high-contrast mb-3">Web Development</h3>
              <p class="text-medium-contrast text-base leading-relaxed">
                Tworzenie wydajnych aplikacji internetowych z wykorzystaniem najnowszych technologii.
              </p>
            </div>
            <div class="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 class="text-xl font-semibold text-high-contrast mb-3">Optymalizacja SEO</h3>
              <p class="text-medium-contrast text-base leading-relaxed">
                Kompleksowa optymalizacja dla wyszukiwarek, zwiększająca widoczność Twojej strony.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    slug: "services",
    seoTitle: "Usługi Web Development | CLT",
    seoDescription: "Kompleksowe usługi tworzenia stron internetowych. Responsywny design, web development, SEO, sklepy internetowe i więcej.",
    seoKeywords: ["usługi web development", "responsywny design", "SEO", "sklepy internetowe", "CMS"]
  }
];

async function migrateContent() {
  try {
    console.log('Starting content migration...');

    // Use a default admin user ID since we're using service role
    const defaultAdminId = '00000000-0000-0000-0000-000000000000';

    for (const page of websiteContent) {
      // Check if page already exists
      const { data: existingPage } = await supabase
        .from('static_pages')
        .select('id')
        .eq('slug', page.slug)
        .single();

      if (existingPage) {
        console.log(`Updating existing page: ${page.slug}`);
        
        const { error: updateError } = await supabase
          .from('static_pages')
          .update({
            title: page.title,
            content: page.content,
            seo_title: page.seoTitle,
            seo_description: page.seoDescription,
            seo_keywords: page.seoKeywords,
            updated_at: new Date().toISOString(),
            user_id: defaultAdminId
          })
          .eq('slug', page.slug);

        if (updateError) {
          throw updateError;
        }
      } else {
        console.log(`Creating new page: ${page.slug}`);
        
        const { error: insertError } = await supabase
          .from('static_pages')
          .insert({
            title: page.title,
            content: page.content,
            slug: page.slug,
            seo_title: page.seoTitle,
            seo_description: page.seoDescription,
            seo_keywords: page.seoKeywords,
            is_published: true,
            published_at: new Date().toISOString(),
            user_id: defaultAdminId
          });

        if (insertError) {
          throw insertError;
        }
      }
    }

    console.log('Content migration completed successfully!');
  } catch (error) {
    console.error('Error during content migration:', error);
    throw error;
  }
}

// Execute migration
migrateContent()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });