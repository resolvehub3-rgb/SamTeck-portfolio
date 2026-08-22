import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  Code, 
  Cpu, 
  Users, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Terminal,
  Layers,
  Database,
  Server
} from 'lucide-react';
import { Profile } from '../types';
import { useImagePreload } from '../hooks/useImagePreload';
import { OptimizedImage } from './common/OptimizedImage';

interface HeroProps {
  profile: Profile;
  onViewWork?: () => void;
  onOpenContact?: () => void;
}

interface StatCounterProps {
  value: string;
  label: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  // Extract prefix, number, and suffix (e.g. "8+", "140+", "99%", "99.8%")
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
  const prefix = match ? match[1] : '';
  const targetNumber = match ? parseFloat(match[2]) : 0;
  const isDecimal = match ? match[2].includes('.') : false;
  const decimalPlaces = isDecimal && match ? match[2].split('.')[1].length : 0;
  const suffix = match ? match[3] : '';

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (isDecimal) {
      return latest.toFixed(decimalPlaces);
    }
    return Math.floor(latest).toString();
  });

  const [displayNumber, setDisplayNumber] = useState('0');

  useEffect(() => {
    if (!match) {
      setDisplayNumber(value);
      return;
    }

    if (isInView) {
      const controls = animate(motionValue, targetNumber, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [isInView, targetNumber, motionValue, match, value]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayNumber(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <div
      ref={ref}
      className="bg-[#0A1A3F] border border-white/5 p-4 rounded-xl hover:border-[#FF6A00]/30 transition-all text-left group"
    >
      <div className="text-2xl sm:text-3xl font-bold text-[#FF6A00] font-heading flex items-baseline">
        {match ? (
          <>
            {prefix && <span>{prefix}</span>}
            <span>{displayNumber}</span>
            {suffix && <span>{suffix}</span>}
          </>
        ) : (
          <span>{value}</span>
        )}
      </div>
      <div className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-wider mt-0.5 group-hover:text-gray-300 transition-colors">
        {label}
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ profile, onViewWork, onOpenContact }) => {
  // Preload critical hero & about assets for instant high-resolution rendering
  useImagePreload([
    {
      src: profile.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      generateResponsiveSrcSet: true,
      fetchPriority: 'high',
    },
    {
      src: profile.aboutImageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
      generateResponsiveSrcSet: true,
      fetchPriority: 'low',
    },
  ]);

  const getIndicatorIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-3.5 h-3.5 text-orange-400" />;
      case 'users':
        return <Users className="w-3.5 h-3.5 text-orange-400" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Code className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  const handleScrollToProjects = () => {
    if (onViewWork) {
      onViewWork();
    } else {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#020B24] bg-grid-pattern"
    >
      {/* Geometric background ambient orange glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6A00] rounded-full blur-[140px] opacity-15 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-5 w-[350px] h-[350px] bg-[#0A1A3F] rounded-full blur-[100px] opacity-50 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Introduction, Headline, CTAs, and Metric Grid */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left z-10">
            {/* Eyebrow badge */}
            <span
              id="hero-eyebrow"
              className="text-[#FF6A00] font-mono text-sm tracking-widest uppercase mb-4 font-semibold inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FF6A00]" />
              <span>{profile.eyebrow || 'Software Architect & Developer'}</span>
            </span>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6 tracking-tight"
            >
              {profile.heroHeadline ? (
                <>
                  {profile.heroHeadline} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#ff9d4d]">
                    {profile.highlightedName || 'Digital Solutions'}
                  </span>
                </>
              ) : (
                <>
                  Building Scalable <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#ff9d4d]">
                    Digital Solutions
                  </span>
                </>
              )}
            </h1>

            {/* Dynamic Bio / Description */}
            <p
              id="hero-description"
              className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl leading-relaxed"
            >
              {profile.heroDescription ||
                'Senior Full-Stack Engineer specializing in high-performance cloud architectures, modern React interfaces, and robust backend systems.'}
            </p>

            {/* 4 Value Indicators */}
            <div
              id="hero-value-indicators"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-8"
            >
              {(profile.valueIndicators && profile.valueIndicators.length > 0
                ? profile.valueIndicators
                : [
                    { id: '1', label: 'Clean Code', icon: 'Code' },
                    { id: '2', label: 'Scalable Architecture', icon: 'Cpu' },
                    { id: '3', label: 'User Focused', icon: 'Users' },
                    { id: '4', label: 'Performance Driven', icon: 'Zap' },
                  ]
              ).map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A1A3F] border border-white/5 text-xs font-medium text-gray-300 hover:border-[#FF6A00]/30 transition-all"
                >
                  <div className="p-1 rounded bg-[#FF6A00]/10">
                    {getIndicatorIcon(indicator.icon)}
                  </div>
                  <span className="truncate">{indicator.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                id="hero-cta-view-work"
                onClick={handleScrollToProjects}
                className="bg-[#FF6A00] hover:bg-[#e55a00] text-white px-8 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF6A00]/20 cursor-pointer text-sm sm:text-base"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                id="hero-cta-download-cv"
                href={profile.cvUrl || '#contact'}
                onClick={(e) => {
                  if (!profile.cvUrl || profile.cvUrl === '#') {
                    e.preventDefault();
                    if (onOpenContact) onOpenContact();
                  }
                }}
                download={profile.cvUrl && profile.cvUrl !== '#' ? 'SamTeck_Digital_CV.pdf' : undefined}
                className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3.5 rounded-lg font-bold text-white transition-colors flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Download CV</span>
                <Download className="w-4 h-4 text-[#FF6A00]" />
              </a>
            </div>

            {/* 3 Metric Cards with Framer Motion Count-up Animations */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
              <StatCounter
                value={profile.yearsExperience || '8+'}
                label="Years Exp"
              />
              <StatCounter
                value={profile.projectsCompleted || '140+'}
                label="Projects"
              />
              <StatCounter
                value={profile.happyClients || '99%'}
                label="Satisfaction"
              />
            </div>
          </div>

          {/* Right Column: Geometric Animated Avatar Visual with Orbit Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
            {/* Animated Orange background blur aura */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1], 
                opacity: [0.2, 0.35, 0.2] 
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] bg-gradient-to-tr from-[#FF6A00] to-[#0D62FE] rounded-full filter blur-[100px] pointer-events-none -z-10" 
            />

            {/* Main Floating Composition Wrapper */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="relative w-72 sm:w-84 h-72 sm:h-84 flex items-center justify-center"
            >
              {/* Outer Counter-Rotating Dashed Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 30, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/15 pointer-events-none"
              >
                {/* Tiny glowing satellite particle on orbit */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00]" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0D62FE] shadow-[0_0_10px_#0D62FE]" />
              </motion.div>

              {/* Inner Pulsing Gradient Ring */}
              <motion.div
                animate={{ 
                  scale: [0.98, 1.02, 0.98],
                  rotate: -360
                }}
                transition={{ 
                  scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 40, repeat: Infinity, ease: 'linear' }
                }}
                className="absolute inset-3 rounded-full border border-blue-500/20 pointer-events-none"
              />

              {/* Main Avatar Container with Gradient Border and Glow */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-64 sm:w-74 h-64 sm:h-74 rounded-full p-1.5 bg-gradient-to-tr from-[#FF6A00] via-blue-500/40 to-[#FF6A00]/80 shadow-2xl shadow-[#FF6A00]/20 group cursor-pointer"
              >
                <div className="w-full h-full rounded-full bg-[#030E2B] p-2 overflow-hidden flex items-center justify-center relative">
                  {/* Subtle ambient sheen effect across the avatar */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none z-10"
                  />

                  <OptimizedImage
                    src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                    alt={profile.name || 'SamTeck Digital Lead Developer'}
                    priority={true}
                    sizes="(max-width: 640px) 256px, 296px"
                    containerClassName="w-full h-full rounded-full overflow-hidden"
                    className="w-full h-full object-cover object-top rounded-full group-hover:scale-108 transition-transform duration-700 ease-out"
                    fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                  />
                </div>
              </motion.div>

              {/* Top-Right Floating Tech Tag (React) */}
              <motion.div
                animate={{ 
                  y: [-6, 6, -6],
                  rotate: [-1.5, 1.5, -1.5]
                }}
                transition={{ 
                  duration: 4.2, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-[#0A1A3F]/95 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-xl shadow-black/40 hover:border-[#FF6A00]/60 transition-colors z-20 cursor-default"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <div className="text-[#FF6A00] font-bold text-base sm:text-lg leading-tight font-heading">React</div>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Framework</div>
              </motion.div>

              {/* Bottom-Left Floating Tech Tag (Node.js) */}
              <motion.div
                animate={{ 
                  y: [6, -6, 6],
                  rotate: [1.5, -1.5, 1.5]
                }}
                transition={{ 
                  duration: 4.8, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-3 bg-[#0A1A3F]/95 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-xl shadow-black/40 hover:border-[#FF6A00]/60 transition-colors z-20 cursor-default"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-[#FF6A00] font-bold text-base sm:text-lg leading-tight font-heading">Node.js</div>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Runtime</div>
              </motion.div>

              {/* Extra Floating Badge (Cloud / Code snippet) */}
              <motion.div
                animate={{ 
                  y: [-4, 4, -4],
                  scale: [0.96, 1.04, 0.96]
                }}
                transition={{ 
                  duration: 3.6, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                className="absolute top-1/2 -left-6 sm:-left-8 -translate-y-1/2 bg-[#0A1A3F]/95 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-xl text-xs font-mono text-[#FF6A00] font-bold hidden sm:flex items-center gap-1.5 z-20"
              >
                <span className="text-blue-400">&lt;</span>
                <span>dev</span>
                <span className="text-blue-400">/&gt;</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
