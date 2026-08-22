import React from 'react';
import { 
  GraduationCap, 
  Code, 
  Briefcase, 
  Trophy, 
  Rocket, 
  Sparkles,
  Milestone,
  Award
} from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const getMilestoneIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'graduationcap':
      case 'education':
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'code':
      case 'developer':
        return <Code className="w-5 h-5 text-white" />;
      case 'briefcase':
      case 'work':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'trophy':
      case 'award':
        return <Trophy className="w-5 h-5 text-white" />;
      case 'rocket':
      case 'founder':
      case 'freelance':
        return <Rocket className="w-5 h-5 text-white" />;
      default:
        return <Award className="w-5 h-5 text-white" />;
    }
  };

  const sortedAchievements = [...achievements].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <section id="achievements" className="py-20 relative overflow-hidden bg-[#020B24] border-t border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF6A00] rounded-full blur-[160px] opacity-10 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>JOURNEY & ACHIEVEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Milestones That Matter
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            A chronological timeline of career growth, academic foundations, and key technical accomplishments.
          </p>
        </div>

        {/* Desktop Horizontal Timeline Track */}
        <div className="hidden lg:block relative my-12">
          {/* Connecting Orange Timeline Line */}
          <div className="absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-[#FF6A00] via-[#ff9d4d] to-[#FF6A00] rounded-full shadow-[0_0_12px_rgba(255,106,0,0.4)] z-0" />

          <div className="grid grid-cols-5 gap-6 relative z-10">
            {sortedAchievements.map((item, index) => (
              <div key={item.id || index} className="flex flex-col items-center text-center group">
                
                {/* Milestone Node Icon with Orange Ring */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#ff9d4d] p-0.5 shadow-lg shadow-[#FF6A00]/30 group-hover:scale-110 transition-transform duration-300 mb-5">
                  <div className="w-full h-full rounded-full bg-[#0A1A3F] flex items-center justify-center border border-[#FF6A00]/40 group-hover:bg-[#FF6A00] transition-colors">
                    {getMilestoneIcon(item.iconName)}
                  </div>
                </div>

                {/* Year Pill */}
                <span className="px-3 py-1 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 text-[#FF6A00] font-mono text-xs font-bold mb-2">
                  {item.year}
                </span>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#FF6A00] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Timeline */}
        <div className="lg:hidden relative pl-6 sm:pl-8 border-l-2 border-[#FF6A00]/50 space-y-8 my-6 ml-4">
          {sortedAchievements.map((item, index) => (
            <div key={item.id || index} className="relative group">
              {/* Node Marker */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#ff9d4d] flex items-center justify-center shadow-lg shadow-[#FF6A00]/30 border-2 border-[#020B24]">
                {getMilestoneIcon(item.iconName)}
              </div>

              {/* Card Container */}
              <div className="p-4 rounded-xl bg-[#0A1A3F] border border-white/5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 text-[#FF6A00] font-mono text-xs font-bold mb-1.5">
                  {item.year}
                </span>
                <h3 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
