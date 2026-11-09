// Unified Admin & Leads Store for Rijschool TEEZ
// Supports persistent localStorage and Supabase sync

export type LeadType = 'registration' | 'trial_lesson' | 'contact' | 'callback';
export type LeadStatus = 'nieuw' | 'in_behandeling' | 'ingepland' | 'ingeschreven' | 'afgerond' | 'gearchiveerd';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
  
  // Specific fields
  gender?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  postalCity?: string;
  packageChoice?: string;
  preferredDate?: string;
  message?: string;
}

export interface AdminSettings {
  adminPin: string;
  notificationEmail: string;
  webhookUrl: string; // e.g. Formspree, Resend, or custom mail endpoint
  notifyOnRegistration: boolean;
  notifyOnTrialLesson: boolean;
  notifyOnContact: boolean;
  dationPlannerUrl: string;
  cbrTopUrl: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  adminPin: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_PIN) || 'teez2026',
  notificationEmail: 'info@rijschoolteez.nl',
  webhookUrl: '',
  notifyOnRegistration: true,
  notifyOnTrialLesson: true,
  notifyOnContact: true,
  dationPlannerUrl: 'https://www.rijlesplanner.nl/',
  cbrTopUrl: 'https://top.cbr.nl/',
};

import { HISTORICAL_LEADS } from './historicalLeads';

const LEADS_KEY = 'teez_admin_leads_v2';
const DELETED_LEADS_KEY = 'teez_admin_deleted_leads_v2';
const SETTINGS_KEY = 'teez_admin_settings_v1';

export function getDeletedLeadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_LEADS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function markLeadDeleted(id: string): void {
  const set = getDeletedLeadIds();
  set.add(id);
  localStorage.setItem(DELETED_LEADS_KEY, JSON.stringify(Array.from(set)));
}

export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getAllLeads(): Lead[] {
  const deleted = getDeletedLeadIds();
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    let leads: Lead[];
    if (!raw) {
      leads = [...HISTORICAL_LEADS];
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } else {
      leads = JSON.parse(raw);
    }
    return leads.filter((lead) => !deleted.has(lead.id));
  } catch {
    return HISTORICAL_LEADS.filter((lead) => !deleted.has(lead.id));
  }
}

export function saveLeads(leads: Lead[]): void {
  const deleted = getDeletedLeadIds();
  const filtered = leads.filter((l) => !deleted.has(l.id));
  localStorage.setItem(LEADS_KEY, JSON.stringify(filtered));
}

import { supabase, isSupabaseConfigured } from './supabase';

export async function syncLeadsWithSupabase(): Promise<Lead[]> {
  const deleted = getDeletedLeadIds();
  const localLeads = getAllLeads();

  if (!isSupabaseConfigured || !supabase) {
    return localLeads.filter((l) => !deleted.has(l.id));
  }

  try {
    const [regRes, trialRes, contactRes] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('trial_lessons').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

    const remoteLeads: Lead[] = [];

    if (regRes.data) {
      for (const r of regRes.data) {
        if (!deleted.has(r.id)) {
          remoteLeads.push({
            id: r.id,
            type: 'registration',
            name: r.full_name,
            email: r.email,
            phone: r.phone,
            status: r.status || 'nieuw',
            createdAt: r.created_at,
            gender: r.gender,
            birthDate: r.birth_date,
            birthPlace: r.birth_place,
            address: r.address,
            postalCity: r.postal_city,
            packageChoice: r.package_choice,
            notes: r.notes,
          });
        }
      }
    }

    if (trialRes.data) {
      for (const t of trialRes.data) {
        if (!deleted.has(t.id)) {
          remoteLeads.push({
            id: t.id,
            type: 'trial_lesson',
            name: t.name,
            email: t.email,
            phone: t.phone,
            status: t.status || 'nieuw',
            createdAt: t.created_at,
            preferredDate: t.preferred_date,
            notes: t.notes,
          });
        }
      }
    }

    if (contactRes.data) {
      for (const c of contactRes.data) {
        if (!deleted.has(c.id)) {
          const isCallback = (c.message || '').includes('Terugbelverzoek');
          remoteLeads.push({
            id: c.id,
            type: isCallback ? 'callback' : 'contact',
            name: c.name,
            email: c.email,
            phone: c.phone,
            status: c.status || 'nieuw',
            createdAt: c.created_at,
            message: c.message,
          });
        }
      }
    }

    // Merge: start with local & historical leads
    const mergedMap = new Map<string, Lead>();
    for (const lead of localLeads) {
      if (!deleted.has(lead.id)) {
        mergedMap.set(lead.id, lead);
      }
    }

    // Overlay remote Supabase leads (latest live submissions)
    for (const remote of remoteLeads) {
      if (!deleted.has(remote.id)) {
        mergedMap.set(remote.id, remote);
      }
    }

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    saveLeads(merged);
    return merged;
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
    return localLeads.filter((l) => !deleted.has(l.id));
  }
}


export function addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const leads = getAllLeads();
  const newLead: Lead = {
    ...leadData,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    status: 'nieuw',
  };
  leads.unshift(newLead);
  saveLeads(leads);

  // Trigger email notification if configured
  triggerEmailNotification(newLead).catch((err) => {
    console.warn('[Admin Dispatch] Email notification warning:', err);
  });

  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = getAllLeads().map((lead) =>
    lead.id === id ? { ...lead, status } : lead
  );
  saveLeads(leads);

  if (isSupabaseConfigured && supabase) {
    Promise.allSettled([
      supabase.from('registrations').update({ status }).eq('id', id),
      supabase.from('trial_lessons').update({ status }).eq('id', id),
      supabase.from('contact_messages').update({ status }).eq('id', id),
    ]).catch(() => {});
  }
}

export function updateLeadNotes(id: string, notes: string): void {
  const leads = getAllLeads().map((lead) =>
    lead.id === id ? { ...lead, notes } : lead
  );
  saveLeads(leads);

  if (isSupabaseConfigured && supabase) {
    Promise.allSettled([
      supabase.from('registrations').update({ notes }).eq('id', id),
      supabase.from('trial_lessons').update({ notes }).eq('id', id),
      supabase.from('contact_messages').update({ message: notes }).eq('id', id),
    ]).catch(() => {});
  }
}

export async function deleteLead(id: string): Promise<void> {
  // 1. Mark in persistent blacklist so it never gets resurrected
  markLeadDeleted(id);

  // 2. Remove from local store
  const leads = getAllLeads().filter((lead) => lead.id !== id);
  saveLeads(leads);

  // 3. Remove from Supabase tables
  if (isSupabaseConfigured && supabase) {
    try {
      await Promise.allSettled([
        supabase.from('registrations').delete().eq('id', id),
        supabase.from('trial_lessons').delete().eq('id', id),
        supabase.from('contact_messages').delete().eq('id', id),
      ]);
    } catch (err) {
      console.warn('[Supabase Delete Error]', err);
    }
  }
}

export function resetLeadsToSample(): void {
  saveLeads(HISTORICAL_LEADS);
}

// Format lead into structured text ready to copy-paste into Dation Student CRM
export function formatLeadForDation(lead: Lead): string {
  const lines = [
    `=== DATION LEERLING IMPORT / AANMELDING ===`,
    `Naam: ${lead.name}`,
    `Geslacht: ${lead.gender || 'Onbekend'}`,
    `Geboortedatum: ${lead.birthDate || 'Niet opgegeven'}`,
    `Geboorteplaats: ${lead.birthPlace || 'Niet opgegeven'}`,
    `Adres: ${lead.address || 'Niet opgegeven'}`,
    `Postcode & Woonplaats: ${lead.postalCity || 'Niet opgegeven'}`,
    `Telefoon: ${lead.phone}`,
    `E-mail: ${lead.email}`,
    `Gekozen pakket: ${lead.packageChoice || lead.preferredDate || 'Proefles / Kennismaking'}`,
    `Opmerkingen: ${lead.notes || lead.message || 'Geen'}`,
    `Datum aanvraag: ${new Date(lead.createdAt).toLocaleString('nl-NL')}`,
  ];
  return lines.join('\n');
}

// Pre-fill WhatsApp message link
export function getWhatsAppLink(lead: Lead): string {
  let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('06')) {
    cleanPhone = '316' + cleanPhone.substring(2);
  } else if (cleanPhone.startsWith('0')) {
    cleanPhone = '31' + cleanPhone.substring(1);
  }

  let text = '';
  if (lead.type === 'registration') {
    text = `Beste ${lead.name}, bedankt voor je aanmelding bij Rijschool TEEZ voor ${lead.packageChoice || 'ons lespakket'}! Wanneer schikt het jou om je proefles/eerste afspraak in te plannen? Met vriendelijke groet, Rijschool TEEZ`;
  } else if (lead.type === 'trial_lesson') {
    text = `Beste ${lead.name}, leuk dat je een proefles hebt aangevraagd bij Rijschool TEEZ! Ik neem graag contact met je op om een datum en tijdstip vast te leggen. Schikt vandaag jou? Groeten, Rijschool TEEZ`;
  } else {
    text = `Beste ${lead.name}, bedankt voor je bericht aan Rijschool TEEZ. Ik zag je vraag binnenkomen en help je graag verder!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// Trigger email notification via Google Workspace /api/send-email or custom webhook
export async function triggerEmailNotification(lead: Lead): Promise<{ success: boolean; message: string }> {
  const settings = getAdminSettings();
  const endpoint = settings.webhookUrl.trim() || '/api/send-email';

  try {
    const payload = {
      to: settings.notificationEmail,
      lead: {
        id: lead.id,
        type: lead.type,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        package: lead.packageChoice,
        preferredDate: lead.preferredDate,
        gender: lead.gender,
        birthDate: lead.birthDate,
        birthPlace: lead.birthPlace,
        address: lead.address,
        postalCity: lead.postalCity,
        message: lead.message || lead.notes,
        createdAt: lead.createdAt,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json().catch(() => ({}));
    return { success: true, message: data.message || 'E-mailnotificatie succesvol verwerkt!' };
  } catch (err) {
    console.error('[Admin Email Error]', err);
    return { success: false, message: String(err) };
  }
}
