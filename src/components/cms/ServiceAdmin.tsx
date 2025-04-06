import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Service } from '../../types/cms';
import { getServices, createService, updateService, deleteService } from '../../services/cmsService';
import * as Icons from 'lucide-react';

const ServiceAdmin: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await deleteService(id);
      setServices(services.filter(service => service.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    }
  };

  const handleSave = async (service: Partial<Service>) => {
    try {
      if (editingService) {
        const updated = await updateService(editingService.id, service);
        setServices(services.map(s => s.id === updated.id ? updated : s));
        setEditingService(null);
      } else {
        const created = await createService(service);
        setServices([...services, created]);
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Error saving service:', err);
      setError('Failed to save service');
    }
  };

  const ServiceForm: React.FC<{
    initialData?: Service;
    onSave: (service: Partial<Service>) => void;
    onCancel: () => void;
  }> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      description: initialData?.description || '',
      icon: initialData?.icon || 'Code',
      orderIndex: initialData?.orderIndex || services.length
    });

    const iconNames = Object.keys(Icons).filter(
      name => typeof Icons[name as keyof typeof Icons] === 'function'
    );

    return (
      <div className="bg-gray-850/50 p-6 rounded-xl mb-6">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              {iconNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Order
            </label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => onCancel()}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {initialData ? 'Update' : 'Create'} Service
            </button>
          </div>
        </div>
      </div>
    );
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
          <h2 className="text-2xl font-bold text-high-contrast">Services</h2>
          <p className="text-medium-contrast mt-1">Manage your website services</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Service
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isCreating && (
        <ServiceForm
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          initialData={editingService}
          onSave={handleSave}
          onCancel={() => setEditingService(null)}
        />
      )}

      <div className="bg-gray-850/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-medium-contrast w-8"></th>
                <th className="text-left p-4 text-medium-contrast">Title</th>
                <th className="text-left p-4 text-medium-contrast">Description</th>
                <th className="text-left p-4 text-medium-contrast">Icon</th>
                <th className="text-left p-4 text-medium-contrast">Order</th>
                <th className="text-right p-4 text-medium-contrast">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.sort((a, b) => a.orderIndex - b.orderIndex).map((service) => {
                const IconComponent = Icons[service.icon as keyof typeof Icons] as React.FC<{ className?: string }>;
                return (
                  <tr
                    key={service.id}
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <GripVertical className="w-4 h-4 text-gray-500" />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-high-contrast">{service.title}</div>
                    </td>
                    <td className="p-4 text-medium-contrast">
                      <div className="max-w-md truncate">{service.description}</div>
                    </td>
                    <td className="p-4">
                      {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                    </td>
                    <td className="p-4 text-medium-contrast">
                      {service.orderIndex}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="p-2 hover:text-primary transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceAdmin;