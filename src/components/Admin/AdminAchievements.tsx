import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Milestone, Check, X } from 'lucide-react';
import { Achievement } from '../../types';

interface AdminAchievementsProps {
  achievements: Achievement[];
  onSaveAchievement: (achievement: Omit<Achievement, 'id'> & { id?: string }) => Promise<void>;
  onDeleteAchievement: (achievementId: string) => Promise<void>;
}

export const AdminAchievements: React.FC<AdminAchievementsProps> = ({
  achievements,
  onSaveAchievement,
  onDeleteAchievement,
}) => {
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const initialNew: Omit<Achievement, 'id'> = {
    year: '2026',
    title: '',
    description: '',
    iconName: 'Rocket',
    displayOrder: achievements.length + 1,
  };

  const [formData, setFormData] = useState<Omit<Achievement, 'id'> & { id?: string }>(initialNew);

  const handleStartCreate = () => {
    setFormData(initialNew);
    setIsCreating(true);
    setEditingAchievement(null);
  };

  const handleStartEdit = (achievement: Achievement) => {
    setFormData({ ...achievement });
    setEditingAchievement(achievement);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAchievement(formData);
    setIsCreating(false);
    setEditingAchievement(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Journey &amp; Milestones Timeline
          </h2>
          <p className="text-sm text-slate-400">
            Manage your career progression, education milestones, awards, and milestones.
          </p>
        </div>

        {!isCreating && !editingAchievement && (
          <button
            onClick={handleStartCreate}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {(isCreating || editingAchievement) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#041031] border border-orange-500/40 shadow-2xl space-y-4 max-w-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
            <h3 className="font-bold text-white">
              {isCreating ? 'Add Milestone' : `Edit Milestone: ${formData.title}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingAchievement(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Year / Date Span
              </label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2024 or 2025 - Present"
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                Icon Representation
              </label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              >
                <option value="GraduationCap">Education / Degree</option>
                <option value="Code">Developer / Freelancing</option>
                <option value="Briefcase">Full-Time Career</option>
                <option value="Trophy">Award / Recognition</option>
                <option value="Rocket">Founder / Growth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
              Milestone Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Top Performer Award"
              className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
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
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingAchievement(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#061845] text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-4 rounded-xl bg-[#041031]/80 border border-blue-900/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold">
                {ach.year}
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                <p className="text-xs text-slate-400">{ach.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(ach)}
                className="p-1.5 rounded-lg bg-[#061845] text-slate-300 hover:text-white"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {confirmDeleteId === ach.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onDeleteAchievement(ach.id);
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
                  onClick={() => setConfirmDeleteId(ach.id)}
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
