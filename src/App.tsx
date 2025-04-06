import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Menu, X, Code, Palette, Database, ShoppingCart, Terminal, Users, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { LazyImage } from './components/LazyImage';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { AnimatedElement } from './components/AnimatedElement';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const PortfolioAdmin = lazy(() => import('./pages/admin/PortfolioAdmin'));
const AdminPanel = lazy(() => import('./components/cms/AdminPanel'));
const ContactForm = lazy(() => import('./components/ContactForm'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <nav 
      ref={ref as any}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isVisible ? 'bg-gray-850/95' : 'bg-gray-850/80'
      } backdrop-blur-sm will-change-transform`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-high-contrast">CLT</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="#home">Strona główna</NavLink>
              <NavLink href="#services">Usługi</NavLink>
              <NavLink href="#portfolio">Portfolio</NavLink>
              <NavLink href="#about">O nas</NavLink>
              <NavLink href="#pricing">Cennik</NavLink>
              <NavLink href="#contact">Kontakt</NavLink>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-high-contrast hover:text-white p-2 transition-smooth duration-300"
              aria-expanded={isOpen}
              aria-label="Przełącz menu nawigacji"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-850/95">
            <MobileNavLink href="#home">Strona główna</MobileNavLink>
            <MobileNavLink href="#services">Usługi</MobileNavLink>
            <MobileNavLink href="#portfolio">Portfolio</MobileNavLink>
            <MobileNavLink href="#about">O nas</MobileNavLink>
            <MobileNavLink href="#pricing">Cennik</MobileNavLink>
            <MobileNavLink href="#contact">Kontakt</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-medium-contrast hover:text-white px-3 py-2 rounded-md text-base font-medium transition-smooth duration-300"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-medium-contrast hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-smooth duration-300"
  >
    {children}
  </a>
);

const ServiceCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <AnimatedElement
    className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-850/70 transition-smooth duration-400 will-change-transform hover:scale-105"
    animation="fade-up"
  >
    <Icon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
    <h3 className="text-xl font-semibold text-high-contrast mb-3">{title}</h3>
    <p className="text-medium-contrast text-base leading-relaxed">{description}</p>
  </AnimatedElement>
);

const ProjectCard = ({ image, title, description }: { image: string; title: string; description: string }) => (
  <AnimatedElement
    className="group relative overflow-hidden rounded-xl will-change-transform"
    animation="fade-up"
  >
    <LazyImage 
      src={image} 
      alt={title} 
      className="w-full h-64 object-cover transition-smooth duration-400 group-hover:scale-110 will-change-transform" 
    />
    <div className="absolute inset-0 bg-gray-850/90 opacity-0 group-hover:opacity-100 transition-smooth duration-400 will-change-opacity flex flex-col justify-center items-center p-6">
      <h3 className="text-xl font-semibold text-high-contrast mb-2">{title}</h3>
      <p className="text-medium-contrast text-base leading-relaxed text-center">{description}</p>
    </div>
  </AnimatedElement>
);

const PricingCard = ({ tier, price, features, onSelect }: { tier: string; price: string; features: string[]; onSelect: () => void }) => (
  <AnimatedElement
    className="bg-gray-850/50 backdrop-blur-sm p-8 rounded-xl hover:bg-gray-850/70 transition-smooth duration-400 will-change-transform hover:scale-105"
    animation="fade-up"
  >
    <h3 className="text-2xl font-bold text-high-contrast mb-4">{tier}</h3>
    <div className="text-4xl font-bold text-primary mb-6">{price}</div>
    <ul className="space-y-4 mb-8" role="list">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-medium-contrast">
          <CheckCircle className="w-5 h-5 text-primary mr-3" aria-hidden="true" />
          <span className="text-base leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onSelect}
      className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg transition-smooth duration-300 will-change-transform hover:scale-105 flex items-center justify-center text-lg disabled:opacity-50 disabled:hover:scale-100"
      aria-label={`Rozpocznij z planem ${tier}`}
    >
      Rozpocznij
    </button>
  </AnimatedElement>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const scrollToContact = (plan?: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      setSelectedPlan(plan);
      const offset = contactSection.offsetTop - 50;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const handleStartProject = () => {
    scrollToContact();
  };

  return (
    <div className="relative z-10">
      <NavBar />
      
      {/* Hero Section */}
      <AnimatedElement
        as="section"
        id="home"
        className="min-h-screen flex items-center justify-center"
        role="banner"
        animation="fade-down"
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-high-contrast">
            Profesjonalne Tworzenie Stron Internetowych
          </h1>
          <p className="text-2xl md:text-3xl text-medium-contrast mb-8 leading-relaxed">
            Nowoczesne rozwiązania dla Twojego biznesu online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartProject}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-smooth duration-300 will-change-transform hover:scale-105 flex items-center justify-center text-lg"
              aria-label="Rozpocznij projekt"
            >
              Rozpocznij Projekt <ArrowRight className="ml-2" aria-hidden="true" />
            </button>
            <button 
              onClick={() => navigate('/portfolio')}
              className="border-2 border-white text-high-contrast px-8 py-3 rounded-lg hover:bg-white/10 transition-smooth duration-300 will-change-transform hover:scale-105 text-lg"
              aria-label="Zobacz nasze portfolio"
            >
              Zobacz Portfolio
            </button>
          </div>
        </div>
      </AnimatedElement>

      {/* Services Section */}
      <AnimatedElement
        as="section"
        id="services"
        className="py-20 px-4 bg-gray-850/40 backdrop-blur-sm"
        role="region"
        aria-labelledby="services-title"
        animation="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="services-title" className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
            Nasze Usługi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={Palette}
              title="Responsywny Design"
              description="Strony internetowe dostosowane do wszystkich urządzeń, z nowoczesnym interfejsem użytkownika."
            />
            <ServiceCard
              icon={Code}
              title="Web Development"
              description="Tworzenie wydajnych aplikacji internetowych z wykorzystaniem najnowszych technologii."
            />
            <ServiceCard
              icon={Database}
              title="Optymalizacja SEO"
              description="Kompleksowa optymalizacja dla wyszukiwarek, zwiększająca widoczność Twojej strony."
            />
            <ServiceCard
              icon={ShoppingCart}
              title="Sklepy Internetowe"
              description="Profesjonalne platformy e-commerce z intuicyjnym systemem zarządzania."
            />
            <ServiceCard
              icon={Terminal}
              title="Systemy CMS"
              description="Łatwe w obsłudze systemy zarządzania treścią, dostosowane do Twoich potrzeb."
            />
            <ServiceCard
              icon={Users}
              title="Wsparcie Techniczne"
              description="Profesjonalne doradztwo i stałe wsparcie techniczne dla Twojej strony."
            />
          </div>
        </div>
      </AnimatedElement>

      {/* Portfolio Section */}
      <AnimatedElement
        as="section"
        id="portfolio"
        className="py-20 px-4 bg-gray-850/40 backdrop-blur-sm"
        role="region"
        aria-labelledby="portfolio-title"
        animation="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="portfolio-title" className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
            Nasze Realizacje
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              image="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800"
              title="Platforma E-commerce"
              description="Nowoczesny sklep internetowy"
            />
            <ProjectCard
              image="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800"
              title="Strona Korporacyjna"
              description="Profesjonalna obecność w sieci"
            />
            <ProjectCard
              image="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800"
              title="Aplikacja Mobilna"
              description="Aplikacja na iOS i Android"
            />
            <ProjectCard
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800"
              title="Panel Analityczny"
              description="Platforma wizualizacji danych"
            />
            <ProjectCard
              image="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800"
              title="Sieć Społecznościowa"
              description="Platforma dla społeczności"
            />
            <ProjectCard
              image="https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800"
              title="Platforma Edukacyjna"
              description="System zarządzania nauczaniem"
            />
          </div>
        </div>
      </AnimatedElement>

      {/* About Section */}
      <AnimatedElement
        as="section"
        id="about"
        className="py-20 px-4 bg-gray-850/40 backdrop-blur-sm"
        role="region"
        aria-labelledby="about-title"
        animation="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="about-title" className="text-4xl md:text-5xl font-bold mb-6 text-high-contrast">O CLT</h2>
              <p className="text-medium-contrast text-lg leading-relaxed mb-8">
                Z ponad dekadą doświadczenia w tworzeniu stron internetowych, CLT jest liderem w tworzeniu innowacyjnych rozwiązań cyfrowych. Nasza pasja do technologii i designu napędza nas do dostarczania wyjątkowych rezultatów dla naszych klientów.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">200+</div>
                  <div className="text-medium-contrast text-lg">Zrealizowanych Projektów</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-medium-contrast text-lg">Zadowolonych Klientów</div>
                </div>
              </div>
            </div>
            <div className="relative will-change-transform hover:scale-105 transition-smooth duration-400">
              <LazyImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"
                alt="Nasz zespół podczas pracy nad projektem"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </AnimatedElement>

      {/* Pricing Section */}
      <AnimatedElement
        as="section"
        id="pricing"
        className="py-20 px-4 bg-gray-850/40 backdrop-blur-sm"
        role="region"
        aria-labelledby="pricing-title"
        animation="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="pricing-title" className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
            Cennik
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              tier="Landing Page"
              price="1500 zł"
              features={[
                "Prosty, responsywny design",
                "Podstawowe SEO",
                "Optymalizacja wydajności",
                "Formularz kontaktowy",
                "CMS (ograniczone funkcje)",
                "1 miesiąc wsparcia technicznego"
              ]}
              onSelect={() => scrollToContact('Landing Page')}
            />
            <PricingCard
              tier="Strona Firmowa"
              price="4000 zł"
              features={[
                "Do 10 podstron",
                "Zaawansowany design",
                "Pełny pakiet SEO",
                "CMS (np. Supabase)",
                "Integracja z API",
                "3 miesiące wsparcia technicznego",
                "Hosting na Netlify + konfiguracja domeny"
              ]}
              onSelect={() => scrollToContact('Strona Firmowa')}
            />
            <PricingCard
              tier="Aplikacja Webowa"
              price="od 7000 zł"
              features={[
                "Niestandardowe funkcje (np. logowanie użytkowników)",
                "E-commerce (np. integracja z Supabase jako baza danych)",
                "Zaawansowana analityka (np. Google Analytics)",
                "6 miesięcy wsparcia technicznego",
                "Optymalizacja aplikacji i wdrożenie na Netlify"
              ]}
              onSelect={() => scrollToContact('Aplikacja Webowa')}
            />
          </div>
        </div>
      </AnimatedElement>

      {/* Contact Section */}
      <AnimatedElement
        as="section"
        id="contact"
        className="py-20 px-4 bg-gray-850/40 backdrop-blur-sm"
        role="region"
        aria-labelledby="contact-title"
        animation="fade-up"
      >
        <div className="max-w-3xl mx-auto">
          <h2 id="contact-title" className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
            Kontakt
          </h2>
          <Suspense fallback={<LoadingFallback />}>
            <ContactForm selectedPlan={selectedPlan} />
          </Suspense>
        </div>
      </AnimatedElement>

      {/* Footer */}
      <footer className="bg-gray-850/40 backdrop-blur-sm py-8 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-medium-contrast text-base">&copy; 2025 CLT. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/admin/portfolio" element={<PortfolioAdmin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}

export default App;