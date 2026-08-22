import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Profile, ContactSubmission } from '../types';
import { submitContactForm } from '../services/portfolioService';
import { useToast } from '../context/ToastContext';

interface ContactCtaProps {
  profile: Profile;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  onSubmit?: (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
}

export const ContactCta: React.FC<ContactCtaProps> = ({ profile, isOpenModal, onCloseModal, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFullForm, setShowFullForm] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please include a brief message about your project.');
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim() || 'Project Inquiry via Portfolio',
        message: message.trim(),
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        await submitContactForm(submissionData);
      }

      setIsSuccess(true);
      toast.success(
        'Message sent successfully!',
        'Your inquiry has been logged in real-time. We will be in touch shortly.'
      );

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF6A00', '#FFA500', '#38BDF8', '#FFFFFF']
      });

      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setErrorMsg('Failed to send message. Please try again or reach out directly via email.');
      toast.error('Failed to submit message', 'Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-[#020B24]">
      {/* Orange Glow Radial behind contact section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#FF6A00] rounded-full blur-[180px] opacity-10 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Glowing Banner Card matching Geometric Balance bottom CTA */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#071946] via-[#0A1A3F] to-[#071946] border border-[#FF6A00]/30 p-8 sm:p-12 shadow-2xl shadow-[#FF6A00]/10 overflow-hidden">
          {/* Subtle geometric line accents */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Heading & Description */}
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 text-[#FF6A00] text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>LET'S WORK TOGETHER</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Have a Project in Mind?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Let's bring your ideas to life. I'm just a message away!
              </p>
            </div>

            {/* Middle: Direct Contact Info Chips */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href={`mailto:${profile.email || 'hello@samteckdigital.com'}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#030E2D] border border-white/5 hover:border-[#FF6A00]/40 text-gray-200 hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF6A00]/10 flex items-center justify-center text-[#FF6A00] group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Email</div>
                  <div className="text-xs sm:text-sm font-semibold truncate text-white">
                    {profile.email || 'hello@samteckdigital.com'}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${profile.phone || '+2348123456789'}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#030E2D] border border-white/5 hover:border-[#FF6A00]/40 text-gray-200 hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF6A00]/10 flex items-center justify-center text-[#FF6A00] group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">Phone</div>
                  <div className="text-xs sm:text-sm font-semibold truncate text-white">
                    {profile.phone || '+234 812 345 6789'}
                  </div>
                </div>
              </a>
            </div>

            {/* Right: Trigger / Send Message Button */}
            <div className="lg:col-span-3 flex justify-start lg:justify-end">
              <button
                id="contact-cta-action-btn"
                onClick={() => setShowFullForm(!showFullForm)}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#FF6A00] hover:bg-[#e55a00] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#FF6A00]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{showFullForm ? 'Hide Form' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Expandable Contact Form */}
          {showFullForm && (
            <div className="mt-10 pt-10 border-t border-white/10">
              <div className="max-w-2xl mx-auto">
                {isSuccess ? (
                  <div className="p-8 rounded-2xl bg-[#030E2D] border border-emerald-500/40 text-center animate-fade-in">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Message Received!
                    </h3>
                    <p className="text-sm text-gray-300 mb-6">
                      Thank you for reaching out. Your inquiry has been logged in our system and I will respond to your email shortly.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#FF6A00] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-semibold">
                          Your Name <span className="text-[#FF6A00]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-[#030E2D] border border-white/10 focus:border-[#FF6A00] focus:outline-none text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-semibold">
                          Email Address <span className="text-[#FF6A00]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#030E2D] border border-white/10 focus:border-[#FF6A00] focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl bg-[#030E2D] border border-white/10 focus:border-[#FF6A00] focus:outline-none text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="New Project / Consulting"
                          className="w-full px-4 py-3 rounded-xl bg-[#030E2D] border border-white/10 focus:border-[#FF6A00] focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-semibold">
                        Your Message <span className="text-[#FF6A00]">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your project goals, scope, and timeline..."
                        className="w-full px-4 py-3 rounded-xl bg-[#030E2D] border border-white/10 focus:border-[#FF6A00] focus:outline-none text-white text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#e55a00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A00]/25 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending to Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
