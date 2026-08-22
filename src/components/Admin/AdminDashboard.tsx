import React from 'react';
import { 
  FolderGit2, 
  Briefcase, 
  Milestone, 
  MessageSquareQuote, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  PlusCircle,
  Database,
  ExternalLink
} from 'lucide-react';
import { Profile, Service, Project, Achievement, Testimonial, ContactSubmission } from '../../types';

interface AdminDashboardProps {
  profile: Profile;
  services: Service[];
  projects: Project[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  messages: ContactSubmission[];
  setActiveTab: (tab: string) => void;
  onToggleAvailability: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profile,
  services,
  projects,
  achievements,
  testimonials,
  messages,
  setActiveTab,
  onToggleAvailability,
}) => {
  const unreadMessages = messages.filter((m) => !m.isRead);

  const stats = [
    {
      label: 'Published Projects',
      value: projects.length,
      icon: FolderGit2,
      tab: 'projects',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Active Services',
      value: services.filter((s) => s.isActive !== false).length,
      icon: Briefcase,
      tab: 'services',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Milestones',
      value: achievements.length,
      icon: Milestone,
      tab: 'achievements',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquareQuote,
      tab: 'testimonials',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Inquiries / Messages',
      value: messages.length,
      subValue: `${unreadMessages.length} unread`,
      icon: Inbox,
      tab: 'messages',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#041235] via-[#081B4B] to-[#041235] border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Management Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {profile.name || 'Samson'}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Manage your live portfolio content, showcase projects, update milestones, and review inquiries from potential clients in real-time.
          </p>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#020B24]/90 border border-blue-900/50">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Availability Status</span>
            <span className={`text-xs font-bold ${profile.openToWork ? 'text-emerald-400' : 'text-slate-400'}`}>
              {profile.openToWork ? '● Open to Work' : '○ Currently Booked'}
            </span>
          </div>
          <button
            onClick={onToggleAvailability}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              profile.openToWork
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {profile.openToWork ? 'Active' : 'Toggle On'}
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(stat.tab)}
              className="p-5 rounded-2xl bg-[#041031]/80 border border-blue-900/40 hover:border-orange-500/40 hover:bg-[#061746] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-heading">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center justify-between">
                  <span>{stat.label}</span>
                  {stat.subValue && (
                    <span className="text-orange-400 font-mono text-[10px] font-bold">
                      {stat.subValue}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Quick Actions & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Management Actions */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 space-y-4">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Quick Content Actions</span>
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#061845] hover:bg-[#0A225F] border border-blue-900/40 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Add or Edit Projects</span>
              </div>
              <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#061845] hover:bg-[#0A225F] border border-blue-900/40 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Update Bio, Photos &amp; Hero Stats</span>
              </div>
              <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#061845] hover:bg-[#0A225F] border border-blue-900/40 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Manage Service Offerings</span>
              </div>
              <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#061845] hover:bg-[#0A225F] border border-blue-900/40 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Site Settings &amp; Defaults Reset</span>
              </div>
              <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Recent Inquiries Inbox Preview */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#041031]/80 border border-blue-900/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Inbox className="w-4 h-4 text-orange-400" />
                <span>Recent Client Messages</span>
              </h3>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                View All ({messages.length}) &rarr;
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                <p>No messages received yet.</p>
                <p className="text-xs text-slate-500 mt-1">Form submissions on your portfolio will show up here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.slice(0, 3).map((msg, i) => (
                  <div
                    key={msg.id || i}
                    onClick={() => setActiveTab('messages')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      msg.isRead
                        ? 'bg-[#030B24] border-blue-950 text-slate-400'
                        : 'bg-[#061845] border-orange-500/30 text-slate-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{msg.name}</span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-blue-900/30 mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Real-time Sync Active</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
