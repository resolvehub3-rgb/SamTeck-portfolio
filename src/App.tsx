import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { 
  getProfile, 
  getServices, 
  getProjects, 
  getAchievements, 
  getTestimonials, 
  getFaqs, 
  getSiteSettings, 
  getContactSubmissions,
  subscribeToContactSubmissions,
  saveContactSubmission,
  updateProfile,
  saveProject,
  deleteProject,
  saveService,
  deleteService,
  saveAchievement,
  deleteAchievement,
  saveTestimonial,
  deleteTestimonial,
  saveFaq,
  deleteFaq,
  updateSiteSettings,
  updateSubmissionReadStatus,
  deleteContactSubmission,
  seedDatabaseIfEmpty
} from './services/portfolioService';
import { 
  defaultProfile, 
  defaultServices, 
  defaultProjects, 
  defaultAchievements, 
  defaultTestimonials, 
  defaultFaqs, 
  defaultSiteSettings 
} from './services/defaultData';
import { 
  Profile, 
  Service, 
  Project, 
  Achievement, 
  Testimonial, 
  Faq, 
  SiteSettings, 
  ContactSubmission 
} from './types';

// Context
import { ToastProvider, useToast } from './context/ToastContext';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { TestimonialsFaq } from './components/TestimonialsFaq';
import { ContactCta } from './components/ContactCta';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { useSEO } from './hooks/useSEO';

// Admin Components
import { AdminLayout, AdminUserProfile } from './components/Admin/AdminLayout';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminProfile } from './components/Admin/AdminProfile';
import { AdminProjects } from './components/Admin/AdminProjects';
import { AdminServices } from './components/Admin/AdminServices';
import { AdminAchievements } from './components/Admin/AdminAchievements';
import { AdminTestimonials } from './components/Admin/AdminTestimonials';
import { AdminFaqs } from './components/Admin/AdminFaqs';
import { AdminMessages } from './components/Admin/AdminMessages';
import { AdminSettings } from './components/Admin/AdminSettings';

function AppContent() {
  const toast = useToast();

  // State for all portfolio models
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [faqs, setFaqs] = useState<Faq[]>(defaultFaqs);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);

  // UI state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<User | AdminUserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem('samteck_admin_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isInitialMessagesLoad = useRef(true);

  // Synchronize Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          sessionStorage.setItem('samteck_admin_session', JSON.stringify({
            displayName: user.displayName || user.email?.split('@')[0] || 'SamTeck Admin',
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          }));
        } catch {}
      } else {
        // If not signed into Firebase Auth, check if session is stored
        const stored = sessionStorage.getItem('samteck_admin_session');
        if (!stored) {
          setCurrentUser(null);
        }
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load all initial data from Firestore / Database
  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      const [
        profileData,
        servicesData,
        projectsData,
        achievementsData,
        testimonialsData,
        faqsData,
        settingsData,
        messagesData,
      ] = await Promise.all([
        getProfile(),
        getServices(),
        getProjects(),
        getAchievements(),
        getTestimonials(),
        getFaqs(),
        getSiteSettings(),
        getContactSubmissions(),
      ]);

      if (profileData) setProfile(profileData);
      if (servicesData.length > 0) setServices(servicesData);
      if (projectsData.length > 0) setProjects(projectsData);
      if (achievementsData.length > 0) setAchievements(achievementsData);
      if (testimonialsData.length > 0) setTestimonials(testimonialsData);
      if (faqsData.length > 0) setFaqs(faqsData);
      if (settingsData) setSettings(settingsData);
      if (messagesData) setMessages(messagesData);
    } catch (err) {
      console.warn('Using default showcase dataset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Real-time Firestore Listener for incoming customer email/contact form submissions
  useEffect(() => {
    const unsubscribe = subscribeToContactSubmissions((latestSubmissions) => {
      setMessages((prev) => {
        // If not initial load and a brand new inquiry arrived, show real-time alert toast!
        if (!isInitialMessagesLoad.current && latestSubmissions.length > prev.length) {
          const newest = latestSubmissions[0];
          if (newest && !newest.isRead) {
            toast.emailAlert(
              `📬 New Client Inquiry from ${newest.name}`,
              `${newest.subject || 'Project Inquiry'}: "${newest.message.substring(0, 80)}${newest.message.length > 80 ? '...' : ''}"`,
              () => {
                setAdminTab('messages');
              }
            );
          }
        }
        isInitialMessagesLoad.current = false;
        return latestSubmissions;
      });
    });

    return () => unsubscribe();
  }, [toast]);

  // Handlers for Admin actions with real-time feedback toasts
  const handleAdminLoginSuccess = (user: User | AdminUserProfile) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('samteck_admin_session', JSON.stringify({
        displayName: user.displayName || user.email?.split('@')[0] || 'SamTeck Admin',
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      }));
    } catch {}
    toast.success('Admin Session Activated', `Welcome back, ${user.displayName || user.email || 'Administrator'}`);
  };

  const handleAdminLogout = async () => {
    try {
      try {
        await signOut(auth);
      } catch {}
      sessionStorage.removeItem('samteck_admin_session');
      setCurrentUser(null);
      toast.info('Signed Out', 'You have been logged out of the Admin Console.');
    } catch (err) {
      console.error('Firebase signOut error:', err);
      sessionStorage.removeItem('samteck_admin_session');
      setCurrentUser(null);
      toast.info('Signed Out', 'Admin session ended.');
    }
  };

  const handleToggleAvailability = async () => {
    const newStatus = !profile.openToWork;
    try {
      setProfile((prev) => ({ ...prev, openToWork: newStatus }));
      await updateProfile({ openToWork: newStatus });
      if (newStatus) {
        toast.success('Status: Available for Work', 'Your portfolio now displays the active green availability indicator.');
      } else {
        toast.info('Status: Booked / Busy', 'Availability badge marked as offline.');
      }
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      toast.error('Update failed', 'Could not save availability status.');
    }
  };

  const handleSaveProfile = async (updated: Partial<Profile>) => {
    try {
      setProfile((prev) => ({ ...prev, ...updated }));
      await updateProfile(updated);
      toast.success('Profile saved successfully', 'Public portfolio bio, titles, and social links updated.');
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast.error('Save failed', 'Could not update profile information.');
    }
  };

  const handleSaveProject = async (proj: Omit<Project, 'id'> & { id?: string }) => {
    try {
      const isNew = !proj.id || proj.id.startsWith('proj-temp-');
      const saved = await saveProject(proj);
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      toast.success(
        'Project saved successfully',
        isNew ? `Project "${saved.name}" created.` : `Project "${saved.name}" updated.`
      );
    } catch (err) {
      console.error('Failed to save project:', err);
      toast.error('Failed to save project', 'Please check your connection and try again.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const target = projects.find((p) => p.id === id);
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted', target ? `"${target.name}" was removed from your portfolio.` : 'Project deleted successfully.');
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error('Delete failed', 'Could not remove the project.');
    }
  };

  const handleSaveService = async (svc: Omit<Service, 'id'> & { id?: string }) => {
    try {
      const isNew = !svc.id || svc.id.startsWith('srv-temp-');
      const saved = await saveService(svc);
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      toast.success(
        'Service saved successfully',
        isNew ? `Service "${saved.title}" created.` : `Service "${saved.title}" updated.`
      );
    } catch (err) {
      console.error('Failed to save service:', err);
      toast.error('Failed to save service', 'Please try again.');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const target = services.find((s) => s.id === id);
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted', target ? `"${target.title}" was removed.` : 'Service removed.');
    } catch (err) {
      console.error('Failed to delete service:', err);
      toast.error('Delete failed', 'Could not remove service.');
    }
  };

  const handleSaveAchievement = async (ach: Omit<Achievement, 'id'> & { id?: string }) => {
    try {
      const saved = await saveAchievement(ach);
      setAchievements((prev) => {
        const idx = prev.findIndex((a) => a.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      toast.success('Achievement saved successfully', `Achievement "${saved.title}" saved.`);
    } catch (err) {
      console.error('Failed to save achievement:', err);
      toast.error('Save failed', 'Could not save achievement.');
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      await deleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a.id !== id));
      toast.success('Achievement deleted', 'Achievement milestone removed.');
    } catch (err) {
      console.error('Failed to delete achievement:', err);
      toast.error('Delete failed', 'Could not remove achievement.');
    }
  };

  const handleSaveTestimonial = async (test: Omit<Testimonial, 'id'> & { id?: string }) => {
    try {
      const saved = await saveTestimonial(test);
      setTestimonials((prev) => {
        const idx = prev.findIndex((t) => t.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      toast.success('Testimonial saved successfully', `Review from "${saved.clientName}" saved.`);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
      toast.error('Save failed', 'Could not save testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success('Testimonial deleted', 'Client review removed.');
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      toast.error('Delete failed', 'Could not remove testimonial.');
    }
  };

  const handleSaveFaq = async (faq: Omit<Faq, 'id'> & { id?: string }) => {
    try {
      const saved = await saveFaq(faq);
      setFaqs((prev) => {
        const idx = prev.findIndex((f) => f.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      toast.success('FAQ saved successfully', 'FAQ question and answer updated.');
    } catch (err) {
      console.error('Failed to save faq:', err);
      toast.error('Save failed', 'Could not save FAQ.');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success('FAQ deleted', 'FAQ entry removed.');
    } catch (err) {
      console.error('Failed to delete faq:', err);
      toast.error('Delete failed', 'Could not remove FAQ.');
    }
  };

  const handleToggleMessageRead = async (id: string, isRead: boolean) => {
    try {
      await updateSubmissionReadStatus(id, isRead);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead } : m))
      );
      toast.info(isRead ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      console.error('Failed to update message status:', err);
      toast.error('Update failed', 'Could not change message status.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteContactSubmission(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Inquiry deleted', 'Client message removed.');
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error('Delete failed', 'Could not remove inquiry.');
    }
  };

  const handleSaveSettings = async (updated: Partial<SiteSettings>) => {
    try {
      setSettings((prev) => ({ ...prev, ...updated }));
      await updateSiteSettings(updated);
      toast.success('Settings saved successfully', 'SEO tags, brand configuration, and URLs updated.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Save failed', 'Could not update site settings.');
    }
  };

  const handleResetDefaults = async () => {
    try {
      await seedDatabaseIfEmpty();
      await loadPortfolioData();
      toast.success('Database restored to default showcase content');
    } catch (err) {
      console.error('Failed to reset database:', err);
      toast.error('Reset failed', 'Could not re-seed database defaults.');
    }
  };

  const handleContactSubmit = async (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'isRead'>) => {
    const newSubmission = await saveContactSubmission(data);
    setMessages((prev) => [newSubmission, ...prev]);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <Routes>
      {/* PUBLIC PORTFOLIO WEBSITE ROUTE */}
      <Route
        path="/"
        element={
          <PublicPortfolioView
            profile={profile}
            settings={settings}
            services={services}
            projects={projects}
            achievements={achievements}
            testimonials={testimonials}
            faqs={faqs}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            handleContactSubmit={handleContactSubmit}
          />
        }
      />

      {/* SECURE ADMIN MANAGEMENT CONSOLE ROUTE */}
      <Route
        path="/admin"
        element={
          <AdminRouteWrapper brandName={settings.brandName || profile.name}>
            {isAuthLoading ? (
              <div className="min-h-screen bg-[#020B24] flex flex-col items-center justify-center p-4">
                <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-400 font-mono">Verifying Firebase authentication...</p>
              </div>
            ) : !currentUser ? (
              <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
            ) : (
              <AdminLayout
                activeTab={adminTab}
                setActiveTab={setAdminTab}
                onLogout={handleAdminLogout}
                unreadCount={unreadCount}
                currentUser={currentUser}
              >
                {adminTab === 'dashboard' && (
                  <AdminDashboard
                    profile={profile}
                    services={services}
                    projects={projects}
                    achievements={achievements}
                    testimonials={testimonials}
                    messages={messages}
                    setActiveTab={setAdminTab}
                    onToggleAvailability={handleToggleAvailability}
                  />
                )}

                {adminTab === 'profile' && (
                  <AdminProfile
                    profile={profile}
                    onSave={handleSaveProfile}
                  />
                )}

                {adminTab === 'projects' && (
                  <AdminProjects
                    projects={projects}
                    onSaveProject={handleSaveProject}
                    onDeleteProject={handleDeleteProject}
                  />
                )}

                {adminTab === 'services' && (
                  <AdminServices
                    services={services}
                    onSaveService={handleSaveService}
                    onDeleteService={handleDeleteService}
                  />
                )}

                {adminTab === 'achievements' && (
                  <AdminAchievements
                    achievements={achievements}
                    onSaveAchievement={handleSaveAchievement}
                    onDeleteAchievement={handleDeleteAchievement}
                  />
                )}

                {adminTab === 'testimonials' && (
                  <AdminTestimonials
                    testimonials={testimonials}
                    onSaveTestimonial={handleSaveTestimonial}
                    onDeleteTestimonial={handleDeleteTestimonial}
                  />
                )}

                {adminTab === 'faqs' && (
                  <AdminFaqs
                    faqs={faqs}
                    onSaveFaq={handleSaveFaq}
                    onDeleteFaq={handleDeleteFaq}
                  />
                )}

                {adminTab === 'messages' && (
                  <AdminMessages
                    messages={messages}
                    onToggleRead={handleToggleMessageRead}
                    onDeleteMessage={handleDeleteMessage}
                  />
                )}

                {adminTab === 'settings' && (
                  <AdminSettings
                    settings={settings}
                    onSaveSettings={handleSaveSettings}
                    onSeedDefaults={handleResetDefaults}
                  />
                )}
              </AdminLayout>
            )}
          </AdminRouteWrapper>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}

interface PublicPortfolioViewProps {
  profile: Profile;
  settings: SiteSettings;
  services: Service[];
  projects: Project[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  faqs: Faq[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  handleContactSubmit: (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
}

function PublicPortfolioView({
  profile,
  settings,
  services,
  projects,
  achievements,
  testimonials,
  faqs,
  selectedProject,
  setSelectedProject,
  handleContactSubmit,
}: PublicPortfolioViewProps) {
  // Dynamically update document title, meta tags, and structured JSON-LD SEO schema
  useSEO(
    {
      title: `${profile.name || settings.brandName || 'SamTeck Digital'} | ${profile.title || 'Software Developer & Solutions Architect'}`,
      description:
        profile.heroDescription ||
        settings.brandTagline ||
        'Senior Full-Stack Engineer building high-performance digital products and scalable systems.',
      ogTitle: `${profile.name || 'SamTeck Digital'} | Software Developer Portfolio`,
      ogDescription:
        profile.heroDescription ||
        'Building scalable, high-performance digital products that solve real-world problems.',
      ogImage: profile.profileImageUrl,
      ogType: 'profile',
      keywords: [
        profile.name,
        'Software Engineer',
        'Full-Stack Developer',
        'React',
        'TypeScript',
        'Node.js',
        'Solutions Architect',
        'Cloud Systems',
        ...(profile.technologies?.map((t) => t.name) || []),
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name || 'SamTeck Digital',
        jobTitle: profile.title || 'Software Developer',
        description: profile.bio || profile.heroDescription,
        email: profile.email,
        telephone: profile.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.location,
        },
        image: profile.profileImageUrl,
        url: typeof window !== 'undefined' ? window.location.origin : '',
        knowsAbout:
          profile.technologies?.map((t) => t.name) || [
            'Software Development',
            'React',
            'Node.js',
            'Cloud Architecture',
          ],
      },
    },
    [
      profile.name,
      profile.title,
      profile.heroDescription,
      profile.profileImageUrl,
      settings.brandName,
    ]
  );

  return (
    <div className="min-h-screen bg-[#020B24] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar profile={profile} settings={settings} />

      <main>
        {/* 1. Hero Section */}
        <Hero profile={profile} />

        {/* 2. About Me Section */}
        <About profile={profile} />

        {/* 3. Services / What I Do Section */}
        <Services services={services} />

        {/* 4. Projects Showcase Section */}
        <Projects
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* 5. Career & Journey Achievements Section */}
        <Achievements achievements={achievements} />

        {/* 6. Testimonials & FAQs Section */}
        <TestimonialsFaq testimonials={testimonials} faqs={faqs} />

        {/* 7. Contact CTA & Inquiries Section */}
        <ContactCta profile={profile} onSubmit={handleContactSubmit} />
      </main>

      {/* 8. Footer */}
      <Footer profile={profile} services={services} settings={settings} />

      {/* Interactive Case Study Project Modal with dynamic SEO */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        brandName={settings.brandName || profile.name}
      />
    </div>
  );
}

function AdminRouteWrapper({
  children,
  brandName,
}: {
  children: React.ReactNode;
  brandName?: string;
}) {
  useSEO(
    {
      title: `Admin Management Console | ${brandName || 'SamTeck Digital'}`,
      description: 'Secure administrative dashboard for portfolio content management.',
    },
    [brandName]
  );

  return <>{children}</>;
}
