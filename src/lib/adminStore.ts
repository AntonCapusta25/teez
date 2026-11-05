// Unified Admin & Leads Store for Rijschool TEEZ
// Supports persistent localStorage and Supabase sync

export type LeadType = 'registration' | 'trial_lesson' | 'contact' | 'callback';
export type LeadStatus = 'nieuw' | 'in_behandeling' | 'ingepland' | 'ingeschreven' | 'gearchiveerd';

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
  adminPin: 'teez2026',
  notificationEmail: 'info@rijschoolteez.nl',
  webhookUrl: '',
  notifyOnRegistration: true,
  notifyOnTrialLesson: true,
  notifyOnContact: true,
  dationPlannerUrl: 'https://www.rijlesplanner.nl/',
  cbrTopUrl: 'https://top.cbr.nl/',
};

const LEADS_KEY = 'teez_admin_leads_v1';
const SETTINGS_KEY = 'teez_admin_settings_v1';

// Seed sample leads if local store is empty so admin is immediately demonstrative
const SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead-001',
    type: 'registration',
    name: 'Sanne van Dijk',
    email: 'sanne.vandijk@gmail.com',
    phone: '06 14253647',
    status: 'nieuw',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
    gender: 'Vrouw',
    birthDate: '2005-08-14',
    birthPlace: 'Utrecht',
    address: 'Amsterdamsestraatweg 142',
    postalCity: '3551 CN Utrecht',
    packageChoice: 'Pakket TEEZ',
    notes: 'Wil zo snel mogelijk beginnen i.v.m. stage.',
  },
  {
    id: 'lead-002',
    type: 'trial_lesson',
    name: 'Bilal el Amrani',
    email: 'bilal.amrani@hotmail.com',
    phone: '06 82736410',
    status: 'in_behandeling',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    preferredDate: 'Aanstaande zaterdagochtend rond 10:00',
    notes: 'Al telefonisch gesproken, zaterdag proefles inplannen in Utrecht Overvecht.',
  },
  {
    id: 'lead-003',
    type: 'callback',
    name: 'Emma de Boer',
    email: 'callback-request@rijschoolteez.nl',
    phone: '06 91827364',
    status: 'nieuw',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    message: 'Terugbelverzoek ontvangen. Voorkeur: Na 17:00 uur (heeft vragen over theoriecursus).',
  },
  {
    id: 'lead-004',
    type: 'registration',
    name: 'Lars Meijer',
    email: 'l.meijer@outlook.com',
    phone: '06 55443322',
    status: 'ingeschreven',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    gender: 'Man',
    birthDate: '2004-11-20',
    birthPlace: 'Nieuwegein',
    address: 'Batauweg 88',
    postalCity: '3437 KH Nieuwegein',
    packageChoice: 'Pakket Z',
    notes: 'Geregistreerd in Dation Rijlesplanner. Eerste rijles gepland.',
  },
];

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
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(SAMPLE_LEADS));
      return SAMPLE_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_LEADS;
  }
}

export function saveLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

import { supabase, isSupabaseConfigured } from './supabase';

export async function syncLeadsWithSupabase(): Promise<Lead[]> {
  if (!isSupabaseConfigured || !supabase) return getAllLeads();

  try {
    const [regRes, trialRes, contactRes] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('trial_lessons').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

    const remoteLeads: Lead[] = [];

    if (regRes.data) {
      for (const r of regRes.data) {
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

    if (trialRes.data) {
      for (const t of trialRes.data) {
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

    if (contactRes.data) {
      for (const c of contactRes.data) {
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

    if (remoteLeads.length > 0) {
      remoteLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLeads(remoteLeads);
      return remoteLeads;
    }
    return getAllLeads();
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
    return getAllLeads();
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
}

export function updateLeadNotes(id: string, notes: string): void {
  const leads = getAllLeads().map((lead) =>
    lead.id === id ? { ...lead, notes } : lead
  );
  saveLeads(leads);
}

export function deleteLead(id: string): void {
  const leads = getAllLeads().filter((lead) => lead.id !== id);
  saveLeads(leads);
}

export function resetLeadsToSample(): void {
  saveLeads(SAMPLE_LEADS);
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
