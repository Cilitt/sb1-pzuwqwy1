import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { StaticPage } from '../../types/cms';
import { getPages, deletePage, publishPage, unpublishPage } from '../../services/cmsService';
import { format } from 'date-fns';

const StaticPageAdmin: React.FC = () => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const data = await getPages(true);
      setPages(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pages');
      console.error('Error fetching pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      await deletePage(id);
      setPages(pages.filter(page => page.id !== id));
    } catch (err) {
      console.error('Error deleting page:', err);
      setError('Failed to delete page');
    }
  };

  const handlePublishToggle = async (page: StaticPage) => {
    try {
      const updatedPage = page.isPublished
        ? await unpublishPage(page.id)
        : await publishPage(page.id);
      
      setPages(pages.map(p => 
        p.id === updatedPage.id ? updatedPage : p
      ));
    } catch (err) {
      console.error('Error toggling page publication:', err);
      setError(`Failed to ${page.isPublished ? 'unpublish' : 'publish'} page`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-high-contrast">Static Pages</h2>
          <p className="text-medium-contrast mt-1">Manage your website pages</p>
        </div>
        <button
          onClick={() => navigate('/admin/pages/new')}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Page
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-850/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-medium-contrast">Title</th>
                <th className="text-left p-4 text-medium-contrast">Slug</th>
                <th className="text-left p-4 text-medium-contrast">Status</th>
                <th className="text-left p-4 text-medium-contrast">Last Updated</th>
                <th className="text-right p-4 text-medium-contrast">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-high-contrast">{page.title}</div>
                  </td>
                  <td className="p-4 text-medium-contrast">
                    <code className="text-sm">{page.slug}</code>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.isPublished
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-medium-contrast">
                    {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePublishToggle(page)}
                        className="p-2 hover:text-primary transition-colors"
                        title={page.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {page.isPublished ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                        className="p-2 hover:text-primary transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaticPageAdmin;