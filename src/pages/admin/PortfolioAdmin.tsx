import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Edit, ArrowLeft, Plus, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  order: number;
  createdAt: string;
}

const PortfolioAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Błąd podczas pobierania projektów:', error);
        return;
      }

      setItems(data as PortfolioItem[]);
    };

    fetchItems();
  }, []);

  const handleRealtimeUpdate = useCallback((payload: {
    new: PortfolioItem;
    old: PortfolioItem;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => {
    setItems(currentItems => {
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      const { error } = await supabase
        .from('portfolio')
        .insert({
          title: file.name,
          imageUrl: publicUrl,
          order: items.length
        });

      if (error) throw error;
    } catch (error) {
      console.error('Błąd podczas przesyłania pliku:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Błąd podczas usuwania projektu:', error);
    }
  };

  const handleSave = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .update({
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags
        })
        .eq('id', item.id);

      if (error) throw error;
      setEditingItem(null);
    } catch (error) {
      console.error('Błąd podczas aktualizacji projektu:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-medium-contrast hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Powrót do Strony Głównej
          </button>
          <h1 className="text-3xl font-bold">Panel Administracyjny Portfolio</h1>
        </div>

        {/* Upload Button */}
        <div className="mb-8">
          <label className="btn-primary inline-flex items-center cursor-pointer">
            <Plus className="w-5 h-5 mr-2" />
            Dodaj Nowy Projekt
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-850/50 rounded-lg overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {editingItem?.id === item.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="input"
                      placeholder="Tytuł"
                    />
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="input"
                      placeholder="Opis"
                    />
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="input"
                      placeholder="Kategoria"
                    />
                    <input
                      type="text"
                      value={editingItem.tags.join(', ')}
                      onChange={(e) => setEditingItem({ 
                        ...editingItem, 
                        tags: e.target.value.split(',').map(tag => tag.trim()) 
                      })}
                      className="input"
                      placeholder="Tagi (oddzielone przecinkami)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(editingItem)}
                        className="btn-primary flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Zapisz
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="btn-secondary flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Anuluj
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 hover:text-primary-500 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAdmin;