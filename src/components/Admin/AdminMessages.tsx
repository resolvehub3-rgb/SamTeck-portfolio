import React, { useState } from 'react';
import { 
  Inbox, 
  Trash2, 
  Mail, 
  Phone, 
  Check, 
  Clock, 
  Search, 
  MessageSquare,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { ContactSubmission } from '../../types';

interface AdminMessagesProps {
  messages: ContactSubmission[];
  onToggleRead: (messageId: string, isRead: boolean) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onToggleRead,
  onDeleteMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter((m) => {
    // Filter by read status
    if (filterType === 'unread' && m.isRead) return false;
    if (filterType === 'read' && !m.isRead) return false;

    // Filter by search
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term) ||
      m.subject?.toLowerCase().includes(term)
    );
  });

  const handleSelect = (msg: ContactSubmission) => {
    setSelectedMessage(msg);
    if (!msg.isRead && msg.id) {
      onToggleRead(msg.id, true);
    }
  };

  const handleToggleReadStatus = async (msg: ContactSubmission, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!msg.id) return;
    try {
      setIsProcessing(msg.id);
      await onToggleRead(msg.id, !msg.isRead);
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isRead: !msg.isRead });
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this client inquiry?')) {
      try {
        setIsProcessing(id);
        await onDeleteMessage(id);
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } finally {
        setIsProcessing(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Live Real-time Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/40">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white font-heading">
              Client Inquiries &amp; Emails
            </h2>
            {/* Live Real-Time Pulse Indicator */}
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium"
              title="Real-time Firestore listener actively watching for new messages"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time messages submitted from the public contact &amp; email forms.
          </p>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          {/* Status filter tabs */}
          <div className="flex items-center p-1 bg-[#041031] border border-blue-900/60 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600/30 text-white border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'unread'
                  ? 'bg-orange-500/30 text-orange-400 border border-orange-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterType('read')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'read'
                  ? 'bg-blue-600/30 text-white border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Read ({messages.length - unreadCount})
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sender, email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#041031] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-xs"
            />
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#041031]/80 border border-blue-900/40 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center mx-auto mb-4 border border-[#FF6A00]/20">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">No Inquiries Received Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            When potential clients submit the email form on your portfolio, their messages will arrive here instantly via Firestore real-time synchronization.
          </p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-[#041031]/60 border border-blue-900/40">
          <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No messages match your current filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try selecting 'All' or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Messages List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#071946] to-[#0A1A3F] border-orange-500/60 shadow-lg shadow-orange-500/10'
                      : msg.isRead
                      ? 'bg-[#041031]/70 border-blue-900/40 hover:bg-[#061845]/50 hover:border-blue-800/60'
                      : 'bg-[#05153E] border-orange-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.isRead ? (
                        <span 
                          className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0 shadow-[0_0_8px_#FF6A00]" 
                          title="Unread message"
                        />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="font-bold text-white text-sm truncate">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="text-xs text-orange-300 font-medium truncate mb-1">
                    {msg.subject || 'Project Inquiry'}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-blue-950/60 text-[11px] text-slate-400">
                    <span className="truncate max-w-[180px] font-mono">{msg.email}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleToggleReadStatus(msg, e)}
                        title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                      >
                        {msg.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(msg.id, e)}
                        title="Delete inquiry"
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Message Reader */}
          <div className="lg:col-span-7 sticky top-4">
            {selectedMessage ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#041031] border border-blue-900/50 shadow-2xl space-y-6">
                
                {/* Reader Header */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-blue-900/40">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-mono uppercase font-semibold mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{selectedMessage.subject || 'Client Inquiry'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      {selectedMessage.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-orange-400 hover:underline flex items-center gap-1.5 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{selectedMessage.email}</span>
                      </a>
                      
                      {selectedMessage.phone && (
                        <>
                          <span className="text-slate-600">&bull;</span>
                          <a 
                            href={`tel:${selectedMessage.phone}`}
                            className="text-slate-300 hover:text-white flex items-center gap-1.5 font-mono"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedMessage.phone}</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReadStatus(selectedMessage)}
                      className="p-2 rounded-xl bg-blue-900/30 text-slate-300 hover:text-white hover:bg-blue-900/50 border border-blue-800/40 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {selectedMessage.isRead ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Unread</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Read</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    <span>Message Body:</span>
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#020B24] border border-blue-900/60 text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Footer Reply Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-blue-900/40">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Logged in Firestore in Real Time</span>
                  </div>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Project Inquiry via SamTeck Digital')}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-amber-500 hover:from-[#e55a00] hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A00]/20 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply to {selectedMessage.name.split(' ')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="min-h-[350px] flex flex-col items-center justify-center p-8 rounded-3xl bg-[#041031]/40 border border-blue-900/40 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="text-base font-bold text-white">Select a Message</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Click any message from the list on the left to read full project scope and directly respond to the client.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
