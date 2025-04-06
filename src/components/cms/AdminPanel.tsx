import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Image, Menu as MenuIcon, Settings, FileEdit } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import ArticleAdmin from './ArticleAdmin';
import ServiceAdmin from './ServiceAdmin';
import StaticPageAdmin from './StaticPageAdmin';
import PortfolioAdmin from '../../pages/admin/PortfolioAdmin';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-medium-contrast hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            <p className="text-gray-400 mb-4">Manage your website articles and blog posts.</p>
            <button
              onClick={() => navigate('/admin/articles')}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Articles
            </button>
          </div>

          <div className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
            <FileEdit className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Static Pages</h2>
            <p className="text-gray-400 mb-4">Manage your website's static pages.</p>
            <button
              onClick={() => navigate('/admin/pages')}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Pages
            </button>
          </div>

          <div className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
            <Image className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
            <p className="text-gray-400 mb-4">Manage your portfolio items and categories.</p>
            <button 
              onClick={() => navigate('/admin/portfolio')}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Portfolio
            </button>
          </div>

          <div className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
            <MenuIcon className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <p className="text-gray-400 mb-4">Manage website navigation and menu items.</p>
            <button
              onClick={() => navigate('/admin/navigation')}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Navigation
            </button>
          </div>

          <div className="bg-gray-850/50 backdrop-blur-sm p-6 rounded-xl">
            <Settings className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <p className="text-gray-400 mb-4">Manage your service offerings and descriptions.</p>
            <button
              onClick={() => navigate('/admin/services')}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Services
            </button>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/articles" element={<ArticleAdmin />} />
          <Route path="/pages" element={<StaticPageAdmin />} />
          <Route path="/portfolio" element={<PortfolioAdmin />} />
          <Route path="/services" element={<ServiceAdmin />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;