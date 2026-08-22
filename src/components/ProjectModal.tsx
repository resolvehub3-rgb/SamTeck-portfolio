import React from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { Project } from '../types';
import { useSEO } from '../hooks/useSEO';
import { OptimizedImage } from './common/OptimizedImage';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  brandName?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, brandName = 'SamTeck Digital' }) => {
  // Dynamically update document title & meta tags when project case study is open
  useSEO(
    project
      ? {
          title: `${project.name} | Case Study - ${brandName}`,
          description: project.shortDescription || project.longDescription?.slice(0, 160),
          ogTitle: `${project.name} - Case Study by ${brandName}`,
          ogDescription: project.shortDescription || project.longDescription?.slice(0, 160),
          ogImage: project.projectImage,
          ogType: 'article',
          keywords: [
            project.name,
            project.category,
            ...(project.technologies || []),
            'Case Study',
            'Portfolio',
          ],
        }
      : {},
    [project?.id, project?.name]
  );

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#030F30] border border-blue-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#061845] text-slate-400 hover:text-white hover:bg-orange-500/20 border border-blue-900/50 transition-all"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image Banner */}
        <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 border border-blue-900/40">
          <OptimizedImage
            src={project.projectImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'}
            alt={project.name}
            priority={true}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030F30] via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-md bg-orange-500 text-white text-xs font-bold font-mono uppercase shadow-lg">
              {project.category || 'Featured Project'}
            </span>
          </div>
        </div>

        {/* Header & Action Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {project.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {project.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#061845] hover:bg-[#0B256B] border border-blue-900/50 text-slate-300 hover:text-white transition-all"
                title="View Source Code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-[#071947] border border-blue-900/40 text-xs font-mono text-orange-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-slate-300">
          
          {/* Overview / Long Description */}
          {project.longDescription && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-2">
                Project Overview
              </h3>
              <p className="leading-relaxed text-slate-300">
                {project.longDescription}
              </p>
            </div>
          )}

          {/* Problem & Solution Grid */}
          {(project.problem || project.solution) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {project.problem && (
                <div className="p-4 rounded-xl bg-[#05143A] border border-blue-900/40">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2 text-xs font-mono uppercase">
                    <AlertCircle className="w-4 h-4" />
                    <span>The Challenge</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-4 rounded-xl bg-[#05143A] border border-blue-900/40">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2 text-xs font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>The Solution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-3">
                Key Highlights & Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Role & Results */}
          {(project.role || project.results) && (
            <div className="p-4 rounded-xl bg-[#041133] border border-blue-900/40 flex flex-col sm:flex-row gap-4 justify-between">
              {project.role && (
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">My Role</div>
                  <div className="font-semibold text-white mt-0.5">{project.role}</div>
                </div>
              )}
              {project.results && (
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Impact & Results</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">{project.results}</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
