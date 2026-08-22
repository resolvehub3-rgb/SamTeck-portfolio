import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Heart, 
  ArrowUp,
  Globe,
  Code
} from 'lucide-react';
import { Profile, Service, SiteSettings } from '../types';
import { BrandLogo } from './common/BrandLogo';

interface FooterProps {
  profile: Profile;
  services: Service[];
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ profile, services, settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'mail':
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#020B24] border-t border-white/5 pt-16 pb-12 relative overflow-hidden text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/5">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="group-hover:scale-105 transition-transform duration-300">
                <BrandLogo size={32} variant="blue" />
              </div>
              <span className="font-heading text-lg font-bold text-white tracking-tight">
                SamTeck<span className="text-[#FF6A00]">Digital</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              {settings.brandTagline || 'Building high-performance digital products and scalable full-stack solutions that drive measurable impact.'}
            </p>

            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-300 font-mono">
                {profile.openToWork ? 'Available for new projects' : 'Currently booked'}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {(services.length > 0 ? services.slice(0, 5) : [
                { title: 'Web Development' },
                { title: 'Backend Development' },
                { title: 'Database Design' },
                { title: 'Cloud & DevOps' },
                { title: 'UI/UX Implementation' },
              ]).map((svc, i) => (
                <li key={i}>
                  <a
                    href="#skills"
                    className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm"
                  >
                    {svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Connect / Socials */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              Follow my work, check open source contributions, or reach out directly.
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {(settings.socialLinks && settings.socialLinks.length > 0
                ? settings.socialLinks
                : [
                    { id: '1', platform: 'GitHub', url: 'https://github.com', iconName: 'Github' },
                    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin' },
                    { id: '3', platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter' },
                    { id: '4', platform: 'Email', url: 'mailto:hello@samteckdigital.com', iconName: 'Mail' },
                  ]
              ).map((soc, idx) => (
                <a
                  key={soc.id || idx}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#0A1A3F] hover:bg-[#FF6A00] text-gray-400 hover:text-white border border-white/5 hover:border-[#FF6A00] flex items-center justify-center transition-all duration-200"
                  title={soc.platform}
                >
                  {getSocialIcon(soc.iconName)}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} {profile.name || settings.brandName || 'SamTeck Digital'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              Designed & Built with <Heart className="w-3.5 h-3.5 text-[#FF6A00] fill-[#FF6A00]" /> by {profile.name || 'SamTeck Digital'}
            </span>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-[#0A1A3F] hover:bg-[#FF6A00] text-gray-400 hover:text-white border border-white/5 transition-all ml-2 cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
