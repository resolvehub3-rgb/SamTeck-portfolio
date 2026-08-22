import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FolderGit2, 
  Milestone, 
  MessageSquareQuote, 
  HelpCircle, 
  Inbox, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu, 
  X, 
  Database, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export interface AdminUserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  uid?: string;
}

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  unreadCount?: number;
  currentUser?: FirebaseUser | AdminUserProfile | null;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  unreadCount = 0,
  currentUser,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Milestone },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#02091D] text-slate-200 flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#040E28] border-b border-blue-950 px-4 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={28} variant="blue" />
          <span className="font-heading font-bold text-white text-sm">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-2 rounded-lg bg-[#061845] text-slate-300 hover:text-orange-400"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg bg-[#061845] text-slate-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#030C24] border-r border-blue-950/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-blue-950/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo size={34} variant="blue" />
              <div>
                <h1 className="font-heading font-bold text-white text-sm leading-none">
                  SamTeck Digital
                </h1>
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  Portfolio CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30'
                      : 'text-slate-400 hover:bg-[#061845]/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white font-mono text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Account */}
        <div className="p-4 border-t border-blue-950/80 space-y-2.5">
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-[#030E2B] border border-blue-900/40 flex items-center gap-2.5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Admin'}
                  className="w-7 h-7 rounded-full object-cover border border-blue-400/30 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white truncate leading-tight">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>{currentUser.email || 'Firebase Auth'}</span>
                </p>
              </div>
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#061845] hover:bg-[#0B256B] text-slate-200 text-xs font-semibold transition-all"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#030C24]/60 border-b border-blue-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <span className="font-heading text-sm font-semibold text-white">
              Authenticated Admin Console
            </span>
            <span className="text-xs text-slate-500 font-mono ml-2">
              (Live PostgreSQL &amp; Firestore Connected)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-[#061845] hover:bg-[#0B256B] border border-blue-900/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Live Preview</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
