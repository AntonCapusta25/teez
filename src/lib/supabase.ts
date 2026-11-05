import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-supabase-url')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface TrialLessonSubmission {
  name: string;
  email: string;
  phone: string;
  preferred_date?: string;
  notes?: string;
}

export interface RegistrationSubmission {
  full_name: string;
  gender: string;
  email: string;
  phone: string;
  birth_date: string;
  birth_place: string;
  address: string;
  postal_city: string;
  package_choice: string;
  notes?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  message: string;
}

import { addLead } from './adminStore';

export async function submitTrialLesson(data: TrialLessonSubmission) {
  // Always register in Admin CRM store
  addLead({
    type: 'trial_lesson',
    name: data.name,
    email: data.email,
    phone: data.phone,
    preferredDate: data.preferred_date,
    notes: data.notes,
  });

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('trial_lessons').insert([data]);
    if (error) throw error;
    return { success: true, mode: 'supabase' };
  } else {
    // Local storage fallback
    const existing = JSON.parse(localStorage.getItem('teez_trial_lessons') || '[]');
    existing.push({ ...data, created_at: new Date().toISOString() });
    localStorage.setItem('teez_trial_lessons', JSON.stringify(existing));
    return { success: true, mode: 'local' };
  }
}

export async function submitRegistration(data: RegistrationSubmission) {
  // Always register in Admin CRM store
  addLead({
    type: 'registration',
    name: data.full_name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    birthDate: data.birth_date,
    birthPlace: data.birth_place,
    address: data.address,
    postalCity: data.postal_city,
    packageChoice: data.package_choice,
    notes: data.notes,
  });

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('registrations').insert([data]);
    if (error) throw error;
    return { success: true, mode: 'supabase' };
  } else {
    // Local storage fallback
    const existing = JSON.parse(localStorage.getItem('teez_registrations') || '[]');
    existing.push({ ...data, created_at: new Date().toISOString() });
    localStorage.setItem('teez_registrations', JSON.stringify(existing));
    return { success: true, mode: 'local' };
  }
}

export async function submitContact(data: ContactSubmission) {
  const isCallback = data.message.includes('Terugbelverzoek');
  // Always register in Admin CRM store
  addLead({
    type: isCallback ? 'callback' : 'contact',
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contact_messages').insert([data]);
    if (error) throw error;
    return { success: true, mode: 'supabase' };
  } else {
    // Local storage fallback
    const existing = JSON.parse(localStorage.getItem('teez_contact_messages') || '[]');
    existing.push({ ...data, created_at: new Date().toISOString() });
    localStorage.setItem('teez_contact_messages', JSON.stringify(existing));
    return { success: true, mode: 'local' };
  }
}

