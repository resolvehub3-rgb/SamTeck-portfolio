import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Layers, 
  FolderGit2,
  Eye
} from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { OptimizedImage } from './common/OptimizedImage';
import { preloadImage } from '../utils/imageUtils';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const list = ['All'];
    projects.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="py-20 relative overflow-hidden bg-[#030E2D] border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#FF6A00] rounded-full blur-[180px] opacity-10 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Geometric Balance layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>FEATURED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selected SaaS & Web Projects
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Engineered for scalability, precision, and business outcomes.
            </p>
          </div>

          <Link
            to="/projects"
            id="view-all-projects-link"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6A00] hover:text-[#ff9d4d] transition-colors group cursor-pointer"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF6A00] text-white shadow-lg shadow-[#FF6A00]/20 font-semibold'
                  : 'bg-[#0A1A3F] text-gray-400 hover:bg-[#0E2459] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-[#0A1A3F] border border-white/5">
            <FolderGit2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No projects found in this category</h3>
            <p className="text-sm text-gray-400 mt-1">Please select another category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id || idx}
                id={`project-card-${project.slug || idx}`}
                className="group relative rounded-2xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 hover:bg-[#0D2254] transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6A00]/5 hover:-translate-y-1.5"
              >
                {/* Project Image Preview Container */}
                <div 
                  className="relative w-full h-44 overflow-hidden bg-[#020B24] cursor-pointer"
                  onClick={() => setActiveProject(project)}
                  onMouseEnter={() => {
                    if (project.projectImage) {
                      preloadImage(project.projectImage);
                    }
                  }}
                >
                  <OptimizedImage
                    src={project.projectImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'}
                    alt={project.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3F] via-transparent to-transparent opacity-80" />

                  {/* Primary Tech Badge pill on top of image */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#020B24]/90 border border-[#FF6A00]/30 text-[#FF6A00] text-[11px] font-mono font-medium backdrop-blur-xs">
                      {project.technologies[0] || project.category || 'Tech'}
                    </span>
                  </div>

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-[#FF6A00]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <div className="px-3.5 py-1.5 rounded-lg bg-[#020B24]/90 border border-[#FF6A00]/40 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#FF6A00]" />
                      <span>Case Study</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category pill badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">
                        {project.category || 'SaaS'}
                      </span>
                      {project.technologies[1] && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#FF6A00]/20 text-[#FF6A00] rounded font-medium">
                          {project.technologies[1]}
                        </span>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 
                      onClick={() => setActiveProject(project)}
                      className="text-base font-bold text-white mb-1.5 group-hover:text-[#FF6A00] transition-colors cursor-pointer"
                    >
                      {project.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Action Links row */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#FF6A00] hover:text-[#ff9d4d] transition-colors"
                      >
                        <span>Live Demo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setActiveProject(project)}
                        className="inline-flex items-center gap-1 font-semibold text-[#FF6A00] hover:text-[#ff9d4d] transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Project Details Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
