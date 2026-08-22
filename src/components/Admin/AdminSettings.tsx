import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Share2, 
  Plus, 
  Trash2,
  Database,
  Loader2
} from 'lucide-react';
import { SiteSettings, SocialLink } from '../../types';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  onSeedDefaults: () => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onSeedDefaults,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: any) => {
    const links = [...(formData.socialLinks || [])];
    if (links[index]) {
      links[index] = { ...links[index], [field]: value };
      setFormData((prev) => ({ ...prev, socialLinks: links }));
    }
  };

  const handleAddSocial = () => {
    const newLink: SocialLink = {
      id: String(Date.now()),
      platform: 'GitHub',
      url: 'https://github.com',
      iconName: 'Github',
      displayOrder: (formData.socialLinks?.length || 0) + 1,
    };
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink],
    }));
  };

  const handleRemoveSocial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveSettings(formData);
      setSuccessMsg('Site settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunSeed = async () => {
    try {
      setIsSeeding(true);
      await onSeedDefaults();
      setShowSeedConfirm(false);
      setSuccessMsg('Database has been re-seeded with pristine default portfolio assets!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error seeding defaults:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Site Settings &amp; Global Config
          </h2>
          <p className="text-sm text-slate-400">
            Configure global brand identity, SEO tags, social media channels, and database maintenance.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Brand & SEO Configuration */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <Globe className="w-4 h-4 text-orange-400" />
          <span>Brand Identity &amp; SEO</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Brand / Company Name
            </label>
            <input
              type="text"
              value={formData.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.brandTagline || ''}
              onChange={(e) => handleChange('brandTagline', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
            Meta SEO Description
          </label>
          <textarea
            rows={2}
            value={formData.metaDescription || ''}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
          />
        </div>
      </div>

      {/* Social Links Manager */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Share2 className="w-4 h-4 text-orange-400" />
            <span>Footer Social Media Channels</span>
          </h3>

          <button
            type="button"
            onClick={handleAddSocial}
            className="px-3.5 py-1.5 rounded-lg bg-[#061845] hover:bg-[#0A225F] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {(formData.socialLinks || []).map((link, idx) => (
            <div
              key={link.id || idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#020B24] border border-blue-900/60"
            >
              <input
                type="text"
                value={link.platform}
                onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                placeholder="Platform"
                className="w-32 px-3 py-1.5 rounded-lg bg-[#041031] border border-blue-900/60 text-xs text-white"
              />

              <input
                type="url"
                value={link.url}
                onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#041031] border border-blue-900/60 text-xs text-white"
              />

              <select
                value={link.iconName}
                onChange={(e) => handleSocialChange(idx, 'iconName', e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#041031] border border-blue-900/60 text-xs text-white"
              >
                <option value="Github">GitHub</option>
                <option value="Linkedin">LinkedIn</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Mail">Email</option>
                <option value="Globe">Website</option>
              </select>

              <button
                type="button"
                onClick={() => handleRemoveSocial(idx)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Reset / Defaults Utility */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17051A] via-[#1F0724] to-[#17051A] border border-rose-900/40 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <Database className="w-4 h-4" />
          <span>Database Seed / Reset Utility</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          If you ever want to restore the rich initial template state (CEO profile, services, projects, achievements, testimonials, and FAQs), you can trigger this action.
        </p>

        {showSeedConfirm ? (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Are you sure? This will populate the Firestore collections with default portfolio items.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSeed}
                disabled={isSeeding}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2"
              >
                {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>Yes, Reset to Default Data</span>
              </button>
              <button
                onClick={() => setShowSeedConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowSeedConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-[#280B32] hover:bg-[#3B0E4A] border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database to Default Showcase Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
