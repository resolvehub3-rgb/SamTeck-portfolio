import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Star, X, Upload } from 'lucide-react';
import { Testimonial } from '../../types';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onSaveTestimonial: (testimonial: Omit<Testimonial, 'id'> & { id?: string }) => Promise<void>;
  onDeleteTestimonial: (testimonialId: string) => Promise<void>;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({
  testimonials,
  onSaveTestimonial,
  onDeleteTestimonial,
}) => {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const initialNew: Omit<Testimonial, 'id'> = {
    clientName: '',
    clientRole: 'Founder & CEO',
    company: 'Startup Inc.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    testimonialText: '',
    rating: 5,
    isFeatured: true,
    displayOrder: testimonials.length + 1,
  };

  const [formData, setFormData] = useState<Omit<Testimonial, 'id'> & { id?: string }>(initialNew);

  const handleStartCreate = () => {
    setFormData(initialNew);
    setIsCreating(true);
    setEditingTestimonial(null);
  };

  const handleStartEdit = (t: Testimonial) => {
    setFormData({ ...t });
    setEditingTestimonial(t);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveTestimonial(formData);
    setIsCreating(false);
    setEditingTestimonial(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Client Testimonials
          </h2>
          <p className="text-sm text-slate-400">
            Showcase genuine endorsements, feedback, and client reviews on the homepage.
          </p>
        </div>

        {!isCreating && !editingTestimonial && (
          <button
            onClick={handleStartCreate}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        )}
      </div>

      {(isCreating || editingTestimonial) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#041031] border border-orange-500/40 shadow-2xl space-y-4 max-w-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
            <h3 className="font-bold text-white">
              {isCreating ? 'Add Testimonial' : `Edit: ${formData.clientName}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTestimonial(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Client Name
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="David Adebayo"
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Client Role
              </label>
              <input
                type="text"
                value={formData.clientRole}
                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                placeholder="CTO & Co-Founder"
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="TechWave Global"
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
              Client Review / Quote
            </label>
            <textarea
              required
              rows={3}
              value={formData.testimonialText}
              onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Star Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTestimonial(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#061845] text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Save Review
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-[#041031]/80 border border-blue-900/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.profileImage}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-orange-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.clientName}</h4>
                    <p className="text-xs text-slate-400">{t.clientRole}, {t.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed mb-4">
                "{t.testimonialText}"
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-900/30">
              <button
                onClick={() => handleStartEdit(t)}
                className="p-1.5 rounded-lg bg-[#061845] text-slate-300 hover:text-white"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {confirmDeleteId === t.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onDeleteTestimonial(t.id);
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
                  onClick={() => setConfirmDeleteId(t.id)}
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
