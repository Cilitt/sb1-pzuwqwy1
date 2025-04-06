import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { AnimatedElement } from '../components/AnimatedElement';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

const PortfolioCard: React.FC<{ item: PortfolioItem }> = ({ item }) => (
  <AnimatedElement className="group relative overflow-hidden rounded-xl bg-gray-850/50 backdrop-blur-sm will-change-transform transition-all duration-500 hover:scale-[1.02]">
    <div className="aspect-[16/10] overflow-hidden">
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
        <p className="text-gray-200 text-sm mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </AnimatedElement>
);

const CategoryFilter: React.FC<{
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}> = ({ categories, activeCategory, onSelect }) => (
  <div className="flex flex-wrap gap-3 mb-8">
    <button
      onClick={() => onSelect('Wszystkie')}
      className={`px-4 py-2 rounded-full transition-all duration-300 ${
        activeCategory === 'Wszystkie'
          ? 'bg-primary-500 text-white'
          : 'bg-gray-850/50 text-gray-400 hover:bg-gray-850 hover:text-white'
      }`}
    >
      Wszystkie
    </button>
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onSelect(category)}
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          activeCategory === category
            ? 'bg-primary-500 text-white'
            : 'bg-gray-850/50 text-gray-400 hover:bg-gray-850 hover:text-white'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Wszystkie');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Błąd podczas pobierania projektów:', error);
        return;
      }

      setPortfolioItems(data as PortfolioItem[]);
    };

    fetchPortfolioItems();
  }, []);

  const handleRealtimeUpdate = useCallback((payload: {
    new: PortfolioItem;
    old: PortfolioItem;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => {
    setPortfolioItems(currentItems => {
      switch (payload.eventType) {
        case 'INSERT':
          return [payload.new, ...currentItems];
        
        case 'UPDATE':
          return currentItems.map(item => 
            item.id === payload.new.id ? payload.new : item
          );
        
        case 'DELETE':
          return currentItems.filter(item => item.id !== payload.old.id);
        
        default:
          return currentItems;
      }
    });
  }, []);

  useRealtimeSubscription('portfolio', handleRealtimeUpdate);

  const categories = Array.from(
    new Set(portfolioItems.map((item) => item.category))
  );

  const filteredItems = activeCategory === 'Wszystkie'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-medium-contrast hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Powrót do Strony Głównej
          </button>
          <h1 className="text-4xl font-bold text-gradient">Nasze Projekty</h1>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;