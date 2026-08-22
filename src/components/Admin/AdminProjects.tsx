import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Github, 
  Check, 
  X, 
  FolderGit2, 
  Image as ImageIcon, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { Project } from '../../types';

interface AdminProjectsProps {
  projects: Project[];
  onSaveProject: (project: Omit<Project, 'id'> & { id?: string }) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialNewProject: Omit<Project, 'id'> = {
    name: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    projectImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    category: 'Full Stack',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: '',
    isFeatured: true,
    displayOrder: projects.length + 1,
    problem: '',
    solution: '',
    role: 'Lead Full-Stack Developer',
    results: '',
  };

  const [formData, setFormData] = useState<Omit<Project, 'id'> & { id?: string }>(initialNewProject);

  const handleStartCreate = () => {
    setFormData(initialNewProject);
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleStartEdit = (project: Project) => {
    setFormData({ ...project });
    setEditingProject(project);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug && !isCreating ? prev.slug : slug,
    }));
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, projectImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveProject(formData);
      setIsCreating(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Projects Management
          </h2>
          <p className="text-sm text-slate-400">
            Showcase your best engineering achievements with live links, source code, and case studies.
          </p>
        </div>

        {!isCreating && !editingProject && (
          <button
            onClick={handleStartCreate}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Editor Modal / Form Container */}
      {(isCreating || editingProject) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-[#041031] border border-orange-500/40 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
            <h3 className="text-lg font-bold text-white font-heading">
              {isCreating ? 'Create New Project' : `Edit: ${formData.name}`}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Project Name <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. TaskFlow SaaS"
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                URL Slug <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="taskflow-saas"
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="SaaS">SaaS</option>
                <option value="Web App">Web App</option>
                <option value="Mobile">Mobile</option>
                <option value="Backend">Backend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder || 1}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Short Summary Description <span className="text-orange-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief 1-2 sentence overview for the project card..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Long Case Study Description
            </label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="Detailed architecture, technical challenges, and full overview..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          {/* Image URL & Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Project Image URL
              </label>
              <input
                type="text"
                value={formData.projectImage}
                onChange={(e) => setFormData({ ...formData, projectImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-sm"
              />
              <div className="mt-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#061845] hover:bg-[#0A225F] text-xs font-medium text-slate-300 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload from Computer</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="h-28 rounded-xl overflow-hidden border border-blue-900/60 bg-[#020B24]">
              <img
                src={formData.projectImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Tech Stack Array */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="e.g. Next.js, GraphQL, PostgreSQL..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-xl bg-[#061845] hover:bg-[#0A225F] text-slate-200 text-xs font-semibold"
              >
                Add Tech
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071947] border border-blue-900/40 text-xs text-orange-300 font-mono"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="hover:text-rose-400 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-sm"
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                The Challenge / Problem
              </label>
              <textarea
                rows={2}
                value={formData.problem || ''}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                The Architectural Solution
              </label>
              <textarea
                rows={2}
                value={formData.solution || ''}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#020B24] border border-blue-900/60 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded-md accent-orange-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-white">
              Feature this project on the homepage
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-900/40">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-[#061845] hover:bg-[#0B256B] text-slate-300 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25"
            >
              {isSaving ? 'Saving...' : 'Save Project to Database'}
            </button>
          </div>
        </form>
      )}

      {/* Projects List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#041031]/80 border border-blue-900/40 hover:border-orange-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={proj.projectImage}
                    alt={proj.name}
                    className="w-12 h-12 rounded-xl object-cover border border-blue-900/50"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">
                      {proj.name}
                    </h3>
                    <span className="text-[11px] font-mono text-orange-400">
                      {proj.category}
                    </span>
                  </div>
                </div>

                {proj.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-mono font-bold">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {proj.shortDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#020B24] text-[11px] font-mono text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-blue-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(proj)}
                  className="p-1.5 rounded-lg bg-[#061845] hover:bg-[#0B256B] text-slate-300 hover:text-white transition-colors"
                  title="Edit Project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {confirmDeleteId === proj.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onDeleteProject(proj.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2 py-1 rounded-md bg-rose-600 text-white text-xs font-bold"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="p-1 rounded-md bg-slate-700 text-slate-300 text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(proj.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
