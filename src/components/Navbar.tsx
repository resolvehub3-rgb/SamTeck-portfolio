import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Home, 
  User, 
  Cpu, 
  FolderGit2, 
  Milestone, 
  MessageSquareQuote, 
  Mail 
} from 'lucide-react';
import { Profile, SiteSettings } from '../types';
import { ScrollProgressBar } from './common/ScrollProgressBar';
import { BrandLogo } from './common/BrandLogo';

interface NavbarProps {
  profile: Profile;
  settings: SiteSettings;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, settings, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section
      const sections = ['home', 'about', 'skills', 'projects', 'achievements', 'testimonials', 'faqs', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', icon: Home },
    { name: 'About', href: '#about', id: 'about', icon: User },
    { name: 'Skills & Services', href: '#skills', id: 'skills', icon: Cpu },
    { name: 'Projects', href: '#projects', id: 'projects', icon: FolderGit2 },
    { name: 'Achievements', href: '#achievements', id: 'achievements', icon: Milestone },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials', icon: MessageSquareQuote },
    { name: 'Contact', href: '#contact', id: 'contact', icon: Mail },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      return; // will navigate through standard routing
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <ScrollProgressBar />
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#020B24]/95 backdrop-blur-md border-b border-white/5 py-3.5 shadow-xl shadow-black/40'
            : 'bg-[#020B24]/80 backdrop-blur-xs border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="group-hover:scale-105 transition-transform duration-300">
              <BrandLogo size={36} variant="blue" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-slate-100 transition-colors">
              SamTeck<span className="text-[#FF6A00]">Digital</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
            {navLinks.map((link) => {
              const isActive = isHome && activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-white border-b-2 border-[#FF6A00]'
                      : 'hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Actions (CTA & Admin button) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/admin"
              id="nav-admin-link"
              title="Admin Management Panel"
              className="p-2.5 rounded-lg border border-white/10 bg-[#0A1A3F] text-gray-400 hover:text-white hover:border-[#FF6A00]/40 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            <button
              id="nav-cta-talk-button"
              onClick={() => {
                if (onOpenContact) {
                  onOpenContact();
                } else {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#FF6A00] hover:bg-[#e55a00] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-[#FF6A00]/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Let's Talk
            </button>
          </div>

          {/* Mobile Menu Open Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/admin"
              className="p-2 rounded-lg text-gray-400 hover:text-[#FF6A00]"
              title="Admin Panel"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-[#0A1A3F] border border-white/10 hover:border-[#FF6A00]/40 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Navigation Drawer with Slide-in from Right & Backdrop Blur */}
      {/* 1. Backdrop Overlay */}
      <div
        id="mobile-drawer-backdrop"
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      />

      {/* 2. Slide-In Right Panel */}
      <aside
        id="mobile-navigation-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 bottom-0 w-[86%] max-w-sm bg-[#030C28]/98 backdrop-blur-2xl border-l border-blue-900/60 shadow-2xl z-50 flex flex-col justify-between p-6 transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header with Brand and Accessible Close Button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-blue-950/80">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={32} variant="blue" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white text-base tracking-tight">
                  SamTeck<span className="text-[#FF6A00]">Digital</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {profile.title || 'Full Stack Engineer'}
                </span>
              </div>
            </div>

            {/* Clear, Accessible Close Button */}
            <button
              id="mobile-drawer-close-button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile menu navigation">
            {navLinks.map((link) => {
              const isActive = isHome && activeSection === link.id;
              const IconComponent = link.icon;
              return (
                <a
                  key={link.id}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#FF6A00]' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#FF6A00] translate-x-0.5' : 'text-slate-600'}`} />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom Actions & Footer */}
        <div className="pt-6 border-t border-blue-950/80 space-y-3">
          {profile.openToWork && (
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for New Projects</span>
            </div>
          )}

          <button
            id="mobile-drawer-cta-talk"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenContact) {
                onOpenContact();
              } else {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-amber-500 hover:from-[#e55a00] hover:to-amber-600 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A00]/25 transition-all cursor-pointer"
          >
            <span>Let's Talk</span>
            <Send className="w-4 h-4" />
          </button>

          <Link
            to="/admin"
            id="mobile-drawer-admin-link"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#0A1A3F] border border-blue-900/50 text-slate-300 text-center text-xs font-semibold hover:text-[#FF6A00] flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Admin Management Panel</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
