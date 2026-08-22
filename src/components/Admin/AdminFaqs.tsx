import React, { useState } from 'react';
import { Plus, Trash2, Edit3, HelpCircle, X } from 'lucide-react';
import { Faq } from '../../types';

interface AdminFaqsProps {
  faqs: Faq[];
  onSaveFaq: (faq: Omit<Faq, 'id'> & { id?: string }) => Promise<void>;
  onDeleteFaq: (faqId: string) => Promise<void>;
}

export const AdminFaqs: React.FC<AdminFaqsProps> = ({ faqs, onSaveFaq, onDeleteFaq }) => {
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const initialNew: Omit<Faq, 'id'> = {
    question: '',
    answer: '',
    displayOrder: faqs.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<Omit<Faq, 'id'> & { id?: string }>(initialNew);

  const handleStartCreate = () => {
    setFormData(initialNew);
    setIsCreating(true);
    setEditingFaq(null);
  };

  const handleStartEdit = (f: Faq) => {
    setFormData({ ...f });
    setEditingFaq(f);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveFaq(formData);
    setIsCreating(false);
    setEditingFaq(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Address common client questions, pricing inquiries, tech stacks, and contract terms.
          </p>
        </div>

        {!isCreating && !editingFaq && (
          <button
            onClick={handleStartCreate}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        )}
      </div>

      {(isCreating || editingFaq) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#041031] border border-orange-500/40 shadow-2xl space-y-4 max-w-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
            <h3 className="font-bold text-white">
              {isCreating ? 'Add Question' : 'Edit Question'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingFaq(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
              Question
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. What is your typical project timeline?"
              className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
              Answer
            </label>
            <textarea
              required
              rows={3}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
                id="faqActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-orange-500"
              />
              <label htmlFor="faqActive" className="text-sm font-semibold text-white">
                Active &amp; Visible
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingFaq(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#061845] text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Save FAQ
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {faqs.map((f) => (
          <div
            key={f.id}
            className="p-4 rounded-xl bg-[#041031]/80 border border-blue-900/40 flex items-start justify-between gap-4"
          >
            <div>
              <h4 className="font-bold text-white text-sm mb-1">{f.question}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{f.answer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(f)}
                className="p-1.5 rounded-lg bg-[#061845] text-slate-300 hover:text-white"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {confirmDeleteId === f.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onDeleteFaq(f.id);
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
                  onClick={() => setConfirmDeleteId(f.id)}
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
