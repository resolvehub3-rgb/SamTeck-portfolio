import React, { useState } from 'react';
import { 
  Save, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2,
  Upload
} from 'lucide-react';
import { Profile } from '../../types';

interface AdminProfileProps {
  profile: Profile;
  onSave: (updatedProfile: Partial<Profile>) => Promise<void>;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIndicatorChange = (index: number, label: string) => {
    const indicators = [...(formData.valueIndicators || [])];
    if (indicators[index]) {
      indicators[index].label = label;
      setFormData((prev) => ({ ...prev, valueIndicators: indicators }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImageUrl' | 'aboutImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('Image is too large for Firestore (max ~500KB). Please use a smaller image or provide a URL instead.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange(field, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top Banner with Save Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Profile &amp; Hero Content
          </h2>
          <p className="text-sm text-slate-400">
            Manage your personal bio, contact channels, hero headline, photos, and statistics.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile changes successfully updated in PostgreSQL database and synced to live portfolio!</span>
        </div>
      )}

      {/* 1. Basic Identity & Contact Info */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <User className="w-4 h-4 text-orange-400" />
          <span>Personal Identity &amp; Contact</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Brand / Highlighted Name (Orange Accent)
            </label>
            <input
              type="text"
              required
              value={formData.highlightedName || ''}
              onChange={(e) => handleChange('highlightedName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Professional Title
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
            About Me Biography
          </label>
          <textarea
            rows={4}
            value={formData.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="openToWork"
            checked={formData.openToWork}
            onChange={(e) => handleChange('openToWork', e.target.checked)}
            className="w-4 h-4 rounded-md accent-orange-500 cursor-pointer"
          />
          <label htmlFor="openToWork" className="text-sm font-semibold text-white cursor-pointer flex items-center gap-2">
            <span>Show "Open to Work" Availability Status</span>
            <span className="text-xs text-emerald-400 font-mono">● Green Indicator</span>
          </label>
        </div>
      </div>

      {/* 2. Hero Section Settings */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Hero Composition &amp; Description</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Eyebrow Label
            </label>
            <input
              type="text"
              value={formData.eyebrow || ''}
              onChange={(e) => handleChange('eyebrow', e.target.value)}
              placeholder="SOFTWARE DEVELOPER"
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Hero Prefix Text
            </label>
            <input
              type="text"
              value={formData.heroHeadline || ''}
              onChange={(e) => handleChange('heroHeadline', e.target.value)}
              placeholder="Hi, I'm"
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
            Hero Intro Description
          </label>
          <textarea
            rows={3}
            value={formData.heroDescription || ''}
            onChange={(e) => handleChange('heroDescription', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
          />
        </div>

        {/* 4 Value Indicators */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
            4 Value Indicators (Displayed under Hero Intro)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(formData.valueIndicators || []).map((indicator, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500">Indicator {idx + 1}</span>
                <input
                  type="text"
                  value={indicator.label}
                  onChange={(e) => handleIndicatorChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#020B24] border border-blue-900/60 text-xs text-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Hero Statistics Floating Card */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <span>Floating Statistics Numbers &amp; CV Link</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Years Experience
            </label>
            <input
              type="text"
              value={formData.yearsExperience || ''}
              onChange={(e) => handleChange('yearsExperience', e.target.value)}
              placeholder="5+"
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm font-bold text-orange-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Projects Completed
            </label>
            <input
              type="text"
              value={formData.projectsCompleted || ''}
              onChange={(e) => handleChange('projectsCompleted', e.target.value)}
              placeholder="35+"
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm font-bold text-orange-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Happy Clients
            </label>
            <input
              type="text"
              value={formData.happyClients || ''}
              onChange={(e) => handleChange('happyClients', e.target.value)}
              placeholder="20+"
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm font-bold text-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
            CV / Resume Download URL
          </label>
          <input
            type="text"
            value={formData.cvUrl || ''}
            onChange={(e) => handleChange('cvUrl', e.target.value)}
            placeholder="https://drive.google.com/... or direct PDF link"
            className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
          />
        </div>
      </div>

      {/* 4. Images & Assets (Profile Photo and Workspace Photo) */}
      <div className="p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-orange-400" />
          <span>Profile &amp; Workspace Imagery</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-slate-300 font-semibold">
              Hero Profile Photo
            </label>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500/50 bg-[#020B24] mb-2">
              <img
                src={formData.profileImageUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              value={formData.profileImageUrl || ''}
              onChange={(e) => handleChange('profileImageUrl', e.target.value)}
              placeholder="Image URL..."
              className="w-full px-3 py-2 rounded-lg bg-[#020B24] border border-blue-900/60 text-xs text-white"
            />
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#061845] hover:bg-[#0A225F] text-xs font-medium text-slate-300 cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'profileImageUrl')}
                className="hidden"
              />
            </label>
          </div>

          {/* About Workspace Photo */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-slate-300 font-semibold">
              About Section Workspace Photo
            </label>
            <div className="w-full h-24 rounded-xl overflow-hidden border border-blue-900/50 bg-[#020B24] mb-2">
              <img
                src={formData.aboutImageUrl}
                alt="Workspace preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              value={formData.aboutImageUrl || ''}
              onChange={(e) => handleChange('aboutImageUrl', e.target.value)}
              placeholder="Image URL..."
              className="w-full px-3 py-2 rounded-lg bg-[#020B24] border border-blue-900/60 text-xs text-white"
            />
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#061845] hover:bg-[#0A225F] text-xs font-medium text-slate-300 cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>Upload Custom Workspace</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'aboutImageUrl')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer"
        >
          {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
};
