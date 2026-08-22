import React from 'react';
import { 
  CodeXml, 
  Smartphone, 
  Database, 
  Cloud, 
  Layout, 
  Rocket, 
  Sparkles, 
  Server,
  Cpu,
  Layers,
  Wrench
} from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'codexml':
      case 'code':
        return <CodeXml className="w-6 h-6 text-orange-400" />;
      case 'smartphone':
      case 'mobile':
      case 'server':
        return <Smartphone className="w-6 h-6 text-orange-400" />;
      case 'database':
        return <Database className="w-6 h-6 text-orange-400" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-orange-400" />;
      case 'layout':
      case 'ui':
      case 'palette':
        return <Layout className="w-6 h-6 text-orange-400" />;
      case 'rocket':
      case 'zap':
      case 'speed':
        return <Rocket className="w-6 h-6 text-orange-400" />;
      default:
        return <Layers className="w-6 h-6 text-orange-400" />;
    }
  };

  const activeServices = services
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-[#020B24]">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FF6A00] rounded-full blur-[160px] opacity-10 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>SKILLS & SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What I Do Best
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            High-caliber full-stack engineering, cloud architecture, and end-to-end digital product craft.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service, index) => (
            <div
              key={service.id || index}
              id={`service-card-${index}`}
              className="group relative p-7 rounded-2xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 hover:bg-[#0D2254] transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#FF6A00]/5 hover:-translate-y-1"
            >
              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#FF6A00]/40 transition-all text-[#FF6A00]">
                  {getServiceIcon(service.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-[#FF6A00] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Bottom subtle accent indicator */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500 group-hover:text-[#FF6A00] transition-colors">
                <span>0{index + 1}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
