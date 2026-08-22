import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Profile,
  Service,
  Project,
  Achievement,
  Testimonial,
  Faq,
  ContactSubmission,
  SiteSettings,
} from '../types';
import {
  defaultProfile,
  defaultServices,
  defaultProjects,
  defaultAchievements,
  defaultTestimonials,
  defaultFaqs,
  defaultSiteSettings,
} from './defaultData';

const PROFILE_DOC_ID = 'main_profile';
const SETTINGS_DOC_ID = 'main_settings';

// --- Profile Operations ---
export async function getProfile(): Promise<Profile> {
  try {
    const docRef = doc(db, 'profile', PROFILE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultProfile, ...(snap.data() as Profile), id: snap.id };
    }
  } catch (error) {
    console.warn('Error reading profile from Firestore, using default state:', error);
  }
  return defaultProfile;
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  const docRef = doc(db, 'profile', PROFILE_DOC_ID);
  await setDoc(docRef, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function updateProfile(profile: Partial<Profile>): Promise<void> {
  await saveProfile(profile);
}

// --- Services Operations ---
export async function getServices(): Promise<Service[]> {
  try {
    const colRef = collection(db, 'services');
    const q = query(colRef, orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
    }
  } catch (error) {
    console.warn('Error reading services from Firestore:', error);
  }
  return defaultServices;
}

export async function saveService(service: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
  if (service.id && !service.id.startsWith('srv-temp-')) {
    const docRef = doc(db, 'services', service.id);
    await setDoc(docRef, service, { merge: true });
    return { ...service, id: service.id } as Service;
  } else {
    const colRef = collection(db, 'services');
    const res = await addDoc(colRef, { ...service, createdAt: new Date().toISOString() });
    return { ...service, id: res.id } as Service;
  }
}

export async function deleteService(serviceId: string): Promise<void> {
  const docRef = doc(db, 'services', serviceId);
  await deleteDoc(docRef);
}

// --- Projects Operations ---
export async function getProjects(): Promise<Project[]> {
  try {
    const colRef = collection(db, 'projects');
    const q = query(colRef, orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    }
  } catch (error) {
    console.warn('Error reading projects from Firestore:', error);
  }
  return defaultProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function saveProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  if (project.id && !project.id.startsWith('proj-temp-')) {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, project, { merge: true });
    return { ...project, id: project.id } as Project;
  } else {
    const colRef = collection(db, 'projects');
    const res = await addDoc(colRef, { ...project, createdAt: new Date().toISOString() });
    return { ...project, id: res.id } as Project;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
}

// --- Achievements Operations ---
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const colRef = collection(db, 'achievements');
    const q = query(colRef, orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement));
    }
  } catch (error) {
    console.warn('Error reading achievements from Firestore:', error);
  }
  return defaultAchievements;
}

export async function saveAchievement(achievement: Omit<Achievement, 'id'> & { id?: string }): Promise<Achievement> {
  if (achievement.id && !achievement.id.startsWith('ach-temp-')) {
    const docRef = doc(db, 'achievements', achievement.id);
    await setDoc(docRef, achievement, { merge: true });
    return { ...achievement, id: achievement.id } as Achievement;
  } else {
    const colRef = collection(db, 'achievements');
    const res = await addDoc(colRef, achievement);
    return { ...achievement, id: res.id } as Achievement;
  }
}

export async function deleteAchievement(achievementId: string): Promise<void> {
  const docRef = doc(db, 'achievements', achievementId);
  await deleteDoc(docRef);
}

// --- Testimonials Operations ---
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const colRef = collection(db, 'testimonials');
    const q = query(colRef, orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial));
    }
  } catch (error) {
    console.warn('Error reading testimonials from Firestore:', error);
  }
  return defaultTestimonials;
}

export async function saveTestimonial(testimonial: Omit<Testimonial, 'id'> & { id?: string }): Promise<Testimonial> {
  if (testimonial.id && !testimonial.id.startsWith('test-temp-')) {
    const docRef = doc(db, 'testimonials', testimonial.id);
    await setDoc(docRef, testimonial, { merge: true });
    return { ...testimonial, id: testimonial.id } as Testimonial;
  } else {
    const colRef = collection(db, 'testimonials');
    const res = await addDoc(colRef, testimonial);
    return { ...testimonial, id: res.id } as Testimonial;
  }
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  const docRef = doc(db, 'testimonials', testimonialId);
  await deleteDoc(docRef);
}

// --- FAQs Operations ---
export async function getFaqs(): Promise<Faq[]> {
  try {
    const colRef = collection(db, 'faqs');
    const q = query(colRef, orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Faq));
    }
  } catch (error) {
    console.warn('Error reading faqs from Firestore:', error);
  }
  return defaultFaqs;
}

export async function saveFaq(faq: Omit<Faq, 'id'> & { id?: string }): Promise<Faq> {
  if (faq.id && !faq.id.startsWith('faq-temp-')) {
    const docRef = doc(db, 'faqs', faq.id);
    await setDoc(docRef, faq, { merge: true });
    return { ...faq, id: faq.id } as Faq;
  } else {
    const colRef = collection(db, 'faqs');
    const res = await addDoc(colRef, faq);
    return { ...faq, id: res.id } as Faq;
  }
}

export async function deleteFaq(faqId: string): Promise<void> {
  const docRef = doc(db, 'faqs', faqId);
  await deleteDoc(docRef);
}

// --- Contact Form Submissions ---
export async function submitContactForm(submission: Omit<ContactSubmission, 'id' | 'isRead' | 'createdAt'>): Promise<ContactSubmission> {
  const colRef = collection(db, 'contact_submissions');
  const now = new Date().toISOString();
  const res = await addDoc(colRef, {
    ...submission,
    isRead: false,
    createdAt: now,
  });
  return {
    ...submission,
    id: res.id,
    isRead: false,
    createdAt: now,
  };
}

export async function saveContactSubmission(submission: Omit<ContactSubmission, 'id' | 'isRead' | 'createdAt'>): Promise<ContactSubmission> {
  return submitContactForm(submission);
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const colRef = collection(db, 'contact_submissions');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
      return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
  } catch (error) {
    console.warn('Error reading contact submissions from Firestore:', error);
  }
  return [];
}

/**
 * Real-time listener for incoming client inquiries / email form submissions
 */
export function subscribeToContactSubmissions(
  callback: (submissions: ContactSubmission[]) => void
): () => void {
  try {
    const colRef = collection(db, 'contact_submissions');
    const unsubscribe = onSnapshot(
      colRef,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
        const sorted = items.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        callback(sorted);
      },
      (error) => {
        console.warn('Real-time contact submissions listener error:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('Could not establish real-time contact listener:', error);
    return () => {};
  }
}

export async function toggleMessageRead(messageId: string, isRead: boolean): Promise<void> {
  const docRef = doc(db, 'contact_submissions', messageId);
  await updateDoc(docRef, { isRead });
}

export async function updateSubmissionReadStatus(messageId: string, isRead: boolean): Promise<void> {
  return toggleMessageRead(messageId, isRead);
}

export async function deleteContactSubmission(messageId: string): Promise<void> {
  const docRef = doc(db, 'contact_submissions', messageId);
  await deleteDoc(docRef);
}

// --- Site Settings Operations ---
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'site_settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultSiteSettings, ...(snap.data() as SiteSettings) };
    }
  } catch (error) {
    console.warn('Error reading site settings from Firestore:', error);
  }
  return defaultSiteSettings;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, 'site_settings', SETTINGS_DOC_ID);
  await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  return saveSiteSettings(settings);
}

// --- Database Seed/Reset Utility ---
export async function seedDatabaseWithDefaults(): Promise<void> {
  await saveProfile(defaultProfile);
  await saveSiteSettings(defaultSiteSettings);

  for (const s of defaultServices) {
    await saveService(s);
  }
  for (const p of defaultProjects) {
    await saveProject(p);
  }
  for (const a of defaultAchievements) {
    await saveAchievement(a);
  }
  for (const t of defaultTestimonials) {
    await saveTestimonial(t);
  }
  for (const f of defaultFaqs) {
    await saveFaq(f);
  }
}

export async function seedDatabaseIfEmpty(): Promise<void> {
  return seedDatabaseWithDefaults();
}
