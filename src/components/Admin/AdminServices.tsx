import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Briefcase, Check, X } from 'lucide-react';
import { Service } from '../../types';

interface AdminServicesProps {
  services: Service[];
  onSaveService: (service: Omit<Service, 'id'> & { id?: string }) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
}

export const AdminServices: React.FC<AdminServicesProps> = ({
  services,
  onSaveService,
  onDeleteService,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const initialNewService: Omit<Service, 'id'> = {
    title: '',
    description: '',
    iconName: 'CodeXml',
    displayOrder: services.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<Omit<Service, 'id'> & { id?: string }>(initialNewService);

  const handleStartCreate = () => {
    setFormData(initialNewService);
    setIsCreating(true);
    setEditingService(null);
  };

  const handleStartEdit = (service: Service) => {
    setFormData({ ...service });
    setEditingService(service);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveService(formData);
    setIsCreating(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Services &amp; Offerings
          </h2>
          <p className="text-sm text-slate-400">
            Define your core technical services, descriptions, and icon representations.
          </p>
        </div>

        {!isCreating && !editingService && (
          <button
            onClick={handleStartCreate}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {(isCreating || editingService) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#041031] border border-orange-500/40 shadow-2xl space-y-4 max-w-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
            <h3 className="font-bold text-white">
              {isCreating ? 'Add Service' : `Edit Service: ${formData.title}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Service Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Web Development"
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Icon Identifier
              </label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              >
                <option value="CodeXml">Code / Frontend (&lt;/&gt;)</option>
                <option value="Smartphone">Smartphone / Mobile</option>
                <option value="Database">Database Cylinder</option>
                <option value="Cloud">Cloud Infrastructure</option>
                <option value="Layout">UI/UX Layout</option>
                <option value="Rocket">Rocket / Performance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
              Description
            </label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="svcActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-orange-500"
              />
              <label htmlFor="svcActive" className="text-sm font-semibold text-white">
                Active &amp; Visible
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#061845] text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-5 rounded-2xl bg-[#041031]/80 border border-blue-900/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-orange-400 font-bold">
                  Order #{svc.displayOrder}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${svc.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {svc.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1">{svc.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{svc.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-900/30">
              <button
                onClick={() => handleStartEdit(svc)}
                className="p-1.5 rounded-lg bg-[#061845] text-slate-300 hover:text-white"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {confirmDeleteId === svc.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onDeleteService(svc.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(svc.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
