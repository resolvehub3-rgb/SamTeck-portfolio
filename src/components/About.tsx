import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Profile } from '../types';
import { OptimizedImage } from './common/OptimizedImage';

interface AboutProps {
  profile: Profile;
  onOpenContact?: () => void;
}

export const About: React.FC<AboutProps> = ({ profile, onOpenContact }) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-[#030E2D] border-t border-b border-white/5">
      {/* Background subtle light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6A00] rounded-full blur-[140px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Workspace / Tech Image Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A1A3F] group-hover:border-[#FF6A00]/30 transition-all duration-500">
              <OptimizedImage
                src={profile.aboutImageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'}
                alt="Workspace and development environment"
                sizes="(max-width: 1024px) 100vw, 500px"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B24] via-[#020B24]/30 to-transparent" />
              
              {/* Floating tech badge on image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0A1A3F]/95 border border-white/10 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6A00]/10 flex items-center justify-center text-[#FF6A00]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-mono uppercase">Specialization</div>
                    <div className="text-sm font-semibold text-white">Full-Stack & Cloud Architecture</div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-[#FF6A00]/20 text-[#FF6A00] font-medium">
                  Verified
                </span>
              </div>
            </div>

            {/* Decorative backdrop glow */}
            <div className="absolute -inset-2 bg-[#FF6A00]/10 rounded-3xl blur-xl -z-10 opacity-70" />
          </div>

          {/* Right Column: Bio & Information Cards */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>ABOUT ME</span>
            </div>

            {/* Section Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Crafting Digital Experiences with Code
            </h2>

            {/* Dynamic Bio Paragraphs */}
            <div className="text-gray-300 text-base leading-relaxed mb-8 space-y-4">
              <p>
                {profile.bio ||
                  "I'm a passionate software developer and solutions architect with a strong foundation in full-stack web and cloud systems. I love turning complex ideas into clean, efficient, and scalable digital solutions."}
              </p>
              <p className="text-gray-400 text-sm">
                With a focus on both software architecture and human-centered design, I specialize in crafting robust backend systems, resilient microservices, and reactive frontend experiences that convert users and scale effortlessly.
              </p>
            </div>

            {/* 4 Information Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
              {/* Name */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 transition-all">
                <div className="p-2.5 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Name</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {profile.name || 'SamTeck Digital'}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 transition-all">
                <div className="p-2.5 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Location</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {profile.location || 'Lagos, Nigeria & Remote'}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 transition-all">
                <div className="p-2.5 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Email</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {profile.email || 'hello@samteckdigital.com'}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0A1A3F] border border-white/5 hover:border-[#FF6A00]/30 transition-all">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <span className="relative flex h-3 w-3">
                    {profile.openToWork && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${profile.openToWork ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Availability</div>
                  <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                    {profile.openToWork ? 'Open to Work' : 'Currently Engaged'}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-4">
              <button
                id="about-more-btn"
                onClick={() => {
                  const el = document.getElementById('skills');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-[#FF6A00] hover:bg-[#e55a00] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FF6A00]/20 hover:scale-105 transition-transform cursor-pointer"
              >
                <span>Explore Skills & Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenContact}
                className="text-sm font-semibold text-[#FF6A00] hover:text-[#ff9d4d] transition-colors cursor-pointer"
              >
                Get in touch &rarr;
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
