import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  LogOut,
  Users,
  Calendar,
  PhoneCall,
  Mail,
  ExternalLink,
  Search,
  Download,
  Copy,
  Check,
  Trash2,
  Settings,
  Bell,
  RefreshCw,
  Send,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import type {
  Lead,
  LeadStatus,
  AdminSettings,
} from '../lib/adminStore';
import {
  getAllLeads,
  updateLeadStatus,
  updateLeadNotes,
  deleteLead,
  resetLeadsToSample,
  getAdminSettings,
  saveAdminSettings,
  formatLeadForDation,
  getWhatsAppLink,
  triggerEmailNotification,
  syncLeadsWithSupabase,
} from '../lib/adminStore';

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('teez_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Data & View State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'dation'>('leads');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Settings State
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  // Load leads from store & Supabase
  const refreshData = async () => {
    setLeads(getAllLeads());
    try {
      const synced = await syncLeadsWithSupabase();
      setLeads(synced);
    } catch {
      // fallback to local leads
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSettings = getAdminSettings();
    if (pinInput.trim() === currentSettings.adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('teez_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Onjuiste pincode. Standaard code is: teez2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('teez_admin_auth');
    setPinInput('');
  };

  // Status Change
  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateLeadStatus(id, newStatus);
    refreshData();
  };

  // Delete Lead
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Weet je zeker dat je de aanvraag van "${name}" wilt verwijderen?`)) {
      deleteLead(id);
      refreshData();
    }
  };

  // Copy Dation Format
  const handleCopyDation = (lead: Lead) => {
    const text = formatLeadForDation(lead);
    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Save Notes
  const handleSaveNotes = (id: string) => {
    updateLeadNotes(id, tempNotes);
    setEditingNotesId(null);
    refreshData();
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Test Email Webhook
  const handleTestEmail = async () => {
    setTestEmailStatus('Versturen van testmelding...');
    const dummyLead: Lead = {
      id: 'test-' + Date.now(),
      type: 'registration',
      name: 'Test Aanmelding',
      email: settings.notificationEmail,
      phone: '06 12345678',
      status: 'nieuw',
      createdAt: new Date().toISOString(),
      packageChoice: 'Pakket TEEZ',
      notes: 'Dit is een geautomatiseerde test om de e-mailnotificaties te verifiëren.',
    };

    const res = await triggerEmailNotification(dummyLead);
    if (res.success) {
      setTestEmailStatus('✅ Testmelding succesvol verstuurd!');
    } else {
      setTestEmailStatus(`❌ Mislukt: ${res.message}`);
    }
    setTimeout(() => setTestEmailStatus(null), 6000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Type', 'Status', 'Datum', 'Naam', 'Telefoon', 'E-mail', 'Pakket/Datum', 'Adres', 'Woonplaats', 'Geboortedatum', 'Notities'];
    const rows = leads.map(l => [
      l.id,
      l.type,
      l.status,
      new Date(l.createdAt).toLocaleDateString('nl-NL'),
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${(l.packageChoice || l.preferredDate || '').replace(/"/g, '""')}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${(l.postalCity || '').replace(/"/g, '""')}"`,
      `"${(l.birthDate || '').replace(/"/g, '""')}"`,
      `"${(l.notes || l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rijschool_teez_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Type filter
      if (filterType !== 'all' && l.type !== filterType) return false;
      // Status filter
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name.toLowerCase().includes(q);
        const matchPhone = l.phone.toLowerCase().includes(q);
        const matchEmail = l.email.toLowerCase().includes(q);
        const matchCity = (l.postalCity || '').toLowerCase().includes(q);
        const matchPkg = (l.packageChoice || '').toLowerCase().includes(q);
        return matchName || matchPhone || matchEmail || matchCity || matchPkg;
      }
      return true;
    });
  }, [leads, filterType, filterStatus, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: leads.length,
      nieuw: leads.filter(l => l.status === 'nieuw').length,
      aanmeldingen: leads.filter(l => l.type === 'registration').length,
      proeflessen: leads.filter(l => l.type === 'trial_lesson').length,
      callbacks: leads.filter(l => l.type === 'callback' || l.type === 'contact').length,
    };
  }, [leads]);

  // RENDER: Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '420px', width: '100%', background: '#fff', borderRadius: '12px', padding: '36px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: '#ffea00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#001a33' }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#001a33', marginBottom: '8px' }}>
            Rijschool TEEZ Beheer
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            Voer de pincode in om toegang te krijgen tot het aanmeldingen- en beheerdashboard.
          </p>

          {authError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '18px', textAlign: 'left' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Pincode (standaard: teez2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 600 }}
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
              Inloggen
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ← Terug naar website
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Code: <code>teez2026</code></span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Authenticated Dashboard
  return (
    <div style={{ background: '#f1f5f9', minHeight: '90vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* Top Header Bar */}
        <div style={{ background: '#001a33', color: '#fff', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#ffea00', color: '#001a33', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Admin Portal
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Live Actief
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Rijschool TEEZ Beheerpaneel
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateHome}
              className="btn btn--outline"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.85rem', padding: '8px 14px' }}
            >
              ← Bekijk website
            </button>
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <LogOut size={16} /> Uitloggen
            </button>
          </div>
        </div>

        {/* Quick Links to Driving School Infrastructure */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <a
            href={settings.dationPlannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Planning & Leerlingen</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#001a33', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                Dation Rijlesplanner <ExternalLink size={14} color="#64748b" />
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Calendar size={20} />
            </div>
          </a>

          <a
            href={settings.cbrTopUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>CBR Reserveringen</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#001a33', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                CBR TOP Portal <ExternalLink size={14} color="#64748b" />
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Users size={20} />
            </div>
          </a>

          <a
            href={`mailto:${settings.notificationEmail}`}
            style={{ background: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>E-mail Postvak</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#001a33', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                {settings.notificationEmail}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Mail size={20} />
            </div>
          </a>
        </div>

        {/* KPI Counter Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Totaal Aanvragen</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#001a33', marginTop: '4px' }}>{stats.total}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: '4px solid #eab308' }}>
            <div style={{ fontSize: '0.8rem', color: '#eab308', fontWeight: 700 }}>Nieuw / Onbehandeld</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ca8a04', marginTop: '4px' }}>{stats.nieuw}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Aanmeldingen</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#001a33', marginTop: '4px' }}>{stats.aanmeldingen}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Proeflessen</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#001a33', marginTop: '4px' }}>{stats.proeflessen}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Terugbel / Berichten</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#001a33', marginTop: '4px' }}>{stats.callbacks}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px' }}>
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'leads' ? '#001a33' : '#64748b',
              borderBottom: activeTab === 'leads' ? '3px solid #ffea00' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={18} /> Aanvragen & Leads ({stats.total})
          </button>

          <button
            onClick={() => setActiveTab('dation')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'dation' ? '#001a33' : '#64748b',
              borderBottom: activeTab === 'dation' ? '3px solid #ffea00' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={18} /> Dation Koppeling Info
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'settings' ? '#001a33' : '#64748b',
              borderBottom: activeTab === 'settings' ? '3px solid #ffea00' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Settings size={18} /> E-mail & Notificatie Instellingen
          </button>
        </div>

        {/* TAB 1: LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            
            {/* Filter and Action Bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '300px' }}>
                {/* Search */}
                <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Zoek op naam, telefoon, plaats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}
                >
                  <option value="all">Alle types</option>
                  <option value="registration">Aanmeldingen</option>
                  <option value="trial_lesson">Proeflessen</option>
                  <option value="callback">Terugbelverzoeken</option>
                  <option value="contact">Contactberichten</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}
                >
                  <option value="all">Alle statussen</option>
                  <option value="nieuw">Nieuw</option>
                  <option value="in_behandeling">In behandeling</option>
                  <option value="ingepland">Ingepland</option>
                  <option value="ingeschreven">Ingeschreven</option>
                  <option value="gearchiveerd">Gearchiveerd</option>
                </select>
              </div>

              {/* Utility actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleExportCsv}
                  style={{ padding: '8px 14px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155' }}
                >
                  <Download size={14} /> Exporteer CSV
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Wil je de demonstratie voorbeelddata herstellen?')) {
                      resetLeadsToSample();
                      refreshData();
                    }
                  }}
                  title="Herstel voorbeelddata"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', cursor: 'pointer', color: '#64748b' }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Leads Table & Cards Container */}
            {filteredLeads.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontWeight: 700, color: '#334155' }}>Geen aanvragen gevonden</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Pas je zoekopdracht of filter aan, of dien een formulier in via de website.</p>
              </div>
            ) : (
              <div>
                {/* Desktop Table View */}
                <div className="admin-table-desktop" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Kandidaat</th>
                        <th style={{ padding: '12px 16px' }}>Type & Details</th>
                        <th style={{ padding: '12px 16px' }}>Contact</th>
                        <th style={{ padding: '12px 16px' }}>Datum</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Snelle Acties</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const statusColors: Record<LeadStatus, { bg: string; text: string }> = {
                          nieuw: { bg: '#fef3c7', text: '#b45309' },
                          in_behandeling: { bg: '#e0f2fe', text: '#0369a1' },
                          ingepland: { bg: '#f3e8ff', text: '#7e22ce' },
                          ingeschreven: { bg: '#dcfce7', text: '#15803d' },
                          gearchiveerd: { bg: '#f1f5f9', text: '#64748b' },
                        };

                        const typeLabels: Record<string, string> = {
                          registration: 'Aanmelding',
                          trial_lesson: 'Proefles',
                          callback: 'Terugbelverzoek',
                          contact: 'Bericht',
                        };

                        const currentStatusColor = statusColors[lead.status] || statusColors.nieuw;

                        return (
                          <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                            {/* Status */}
                            <td style={{ padding: '14px 16px' }}>
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                style={{
                                  background: currentStatusColor.bg,
                                  color: currentStatusColor.text,
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="nieuw">Nieuw</option>
                                <option value="in_behandeling">In behandeling</option>
                                <option value="ingepland">Ingepland</option>
                                <option value="ingeschreven">Ingeschreven</option>
                                <option value="gearchiveerd">Gearchiveerd</option>
                              </select>
                            </td>

                            {/* Candidate info */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 800, color: '#001a33', fontSize: '0.95rem' }}>{lead.name}</div>
                              {lead.gender && (
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {lead.gender} • Geb. {lead.birthDate || 'onbekend'} {lead.birthPlace ? `(${lead.birthPlace})` : ''}
                                </div>
                              )}
                              {lead.address && (
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  📍 {lead.address}, {lead.postalCity}
                                </div>
                              )}
                            </td>

                            {/* Type & Details */}
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-block', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                                {typeLabels[lead.type] || lead.type}
                              </span>
                              {lead.packageChoice && (
                                <div style={{ fontWeight: 600, color: '#0284c7', fontSize: '0.85rem' }}>
                                  🏷️ {lead.packageChoice}
                                </div>
                              )}
                              {lead.preferredDate && (
                                <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '2px' }}>
                                  🗓️ {lead.preferredDate}
                                </div>
                              )}
                              {lead.message && (
                                <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px', maxWidth: '320px' }}>
                                  "{lead.message}"
                                </div>
                              )}

                              {/* Internal Notes */}
                              <div style={{ marginTop: '6px' }}>
                                {editingNotesId === lead.id ? (
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      value={tempNotes}
                                      onChange={(e) => setTempNotes(e.target.value)}
                                      placeholder="Notitie toevoegen..."
                                      style={{ fontSize: '0.78rem', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                    />
                                    <button onClick={() => handleSaveNotes(lead.id)} style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#001a33', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Opslaan</button>
                                    <button onClick={() => setEditingNotesId(null)} style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'none', border: 'none', cursor: 'pointer' }}>Annuleer</button>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.78rem', color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => { setEditingNotesId(lead.id); setTempNotes(lead.notes || ''); }}>
                                    📝 {lead.notes ? <span>{lead.notes}</span> : <span style={{ color: '#94a3b8' }}>+ Notitie toevoegen</span>}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Contact Info */}
                            <td style={{ padding: '14px 16px' }}>
                              <div>
                                <a href={`tel:${lead.phone}`} style={{ color: '#001a33', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <PhoneCall size={13} color="#2563eb" /> {lead.phone}
                                </a>
                              </div>
                              <div style={{ marginTop: '4px' }}>
                                <a href={`mailto:${lead.email}`} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Mail size={13} /> {lead.email}
                                </a>
                              </div>
                            </td>

                            {/* Date */}
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> {new Date(lead.createdAt).toLocaleDateString('nl-NL')}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {new Date(lead.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <a
                                  href={getWhatsAppLink(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp sturen"
                                  style={{ background: '#25D366', color: '#fff', padding: '6px 8px', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <MessageSquare size={14} />
                                </a>

                                <button
                                  onClick={() => handleCopyDation(lead)}
                                  title="Kopieer voor Dation"
                                  style={{ background: copiedId === lead.id ? '#10b981' : '#f1f5f9', color: copiedId === lead.id ? '#fff' : '#001a33', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}
                                >
                                  {copiedId === lead.id ? <Check size={14} /> : <Copy size={14} />}
                                  {copiedId === lead.id ? 'Gekopieerd!' : 'Dation'}
                                </button>

                                <button
                                  onClick={() => handleDelete(lead.id, lead.name)}
                                  title="Verwijderen"
                                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View (Visible on smartphones) */}
                <div className="admin-cards-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
                  {filteredLeads.map((lead) => {
                    const statusColors: Record<LeadStatus, { bg: string; text: string }> = {
                      nieuw: { bg: '#fef3c7', text: '#b45309' },
                      in_behandeling: { bg: '#e0f2fe', text: '#0369a1' },
                      ingepland: { bg: '#f3e8ff', text: '#7e22ce' },
                      ingeschreven: { bg: '#dcfce7', text: '#15803d' },
                      gearchiveerd: { bg: '#f1f5f9', text: '#64748b' },
                    };

                    const typeLabels: Record<string, string> = {
                      registration: 'Aanmelding',
                      trial_lesson: 'Proefles',
                      callback: 'Terugbelverzoek',
                      contact: 'Bericht',
                    };

                    const currentStatusColor = statusColors[lead.status] || statusColors.nieuw;

                    return (
                      <div key={lead.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {/* Header: Name + Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 800, color: '#001a33', fontSize: '1.05rem' }}>{lead.name}</div>
                            <span style={{ display: 'inline-block', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, marginTop: '2px' }}>
                              {typeLabels[lead.type] || lead.type}
                            </span>
                          </div>

                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            style={{
                              background: currentStatusColor.bg,
                              color: currentStatusColor.text,
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="nieuw">Nieuw</option>
                            <option value="in_behandeling">In behandeling</option>
                            <option value="ingepland">Ingepland</option>
                            <option value="ingeschreven">Ingeschreven</option>
                            <option value="gearchiveerd">Gearchiveerd</option>
                          </select>
                        </div>

                        {/* Details */}
                        <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '12px' }}>
                          {lead.packageChoice && (
                            <div style={{ color: '#0284c7', fontWeight: 700 }}>
                              🏷️ {lead.packageChoice}
                            </div>
                          )}
                          {lead.preferredDate && (
                            <div>🗓️ Voorkeur: {lead.preferredDate}</div>
                          )}
                          {lead.address && (
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              📍 {lead.address}, {lead.postalCity}
                            </div>
                          )}
                          {lead.message && (
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px', background: '#f8fafc', padding: '6px 10px', borderRadius: '4px' }}>
                              "{lead.message}"
                            </div>
                          )}
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                            Ontvangen: {new Date(lead.createdAt).toLocaleDateString('nl-NL')} om {new Date(lead.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Notes */}
                        <div style={{ marginBottom: '14px', fontSize: '0.8rem' }}>
                          {editingNotesId === lead.id ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input
                                type="text"
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Notitie..."
                                style={{ flex: 1, padding: '6px 8px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                              />
                              <button onClick={() => handleSaveNotes(lead.id)} style={{ padding: '6px 12px', background: '#001a33', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700 }}>OK</button>
                            </div>
                          ) : (
                            <div onClick={() => { setEditingNotesId(lead.id); setTempNotes(lead.notes || ''); }} style={{ color: '#059669', cursor: 'pointer' }}>
                              📝 {lead.notes ? <strong>{lead.notes}</strong> : <span style={{ color: '#94a3b8' }}>+ Notitie toevoegen</span>}
                            </div>
                          )}
                        </div>

                        {/* Mobile Action Buttons Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '8px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                          <a
                            href={getWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ background: '#25D366', color: '#fff', padding: '10px 8px', borderRadius: '6px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700 }}
                          >
                            <MessageSquare size={16} /> WhatsApp
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            style={{ background: '#001a33', color: '#fff', padding: '10px 8px', borderRadius: '6px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700 }}
                          >
                            <PhoneCall size={14} /> Bellen
                          </a>

                          <button
                            onClick={() => handleCopyDation(lead)}
                            style={{ background: copiedId === lead.id ? '#10b981' : '#f1f5f9', color: copiedId === lead.id ? '#fff' : '#001a33', border: 'none', padding: '10px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700 }}
                          >
                            {copiedId === lead.id ? <Check size={14} /> : <Copy size={14} />}
                            {copiedId === lead.id ? 'Gekopieerd' : 'Dation'}
                          </button>

                          <button
                            onClick={() => handleDelete(lead.id, lead.name)}
                            style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 10px', borderRadius: '6px', cursor: 'pointer' }}
                            title="Verwijderen"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DATION INTEGRATION INFO */}
        {activeTab === 'dation' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', background: '#ffea00', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001a33' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001a33' }}>
                  Hoe was Rijschool TEEZ verbonden met Dation?
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Resultaat uit de analyse van de database en e-mailarchieven.
                </p>
              </div>
            </div>

            <div style={{ lineHeight: 1.7, color: '#334155', fontSize: '0.95rem' }}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #0284c7', marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 700, color: '#0284c7', marginBottom: '6px' }}>
                  1. De Authentieke Koppeling (WordPress &rarr; Dation)
                </h4>
                <p style={{ margin: 0 }}>
                  Op de originele WordPress-site was er <strong>geen directe API-koppeling</strong> in de broncode. In plaats daarvan was Dation gekoppeld via een speciale widget en app-verwijzing naar <code>https://www.rijlesplanner.nl/</code>.
                </p>
                <p style={{ marginTop: '8px', marginBottom: 0 }}>
                  De tekst in de originele widget luidde:
                  <br />
                  <em style={{ color: '#475569' }}>"Rijschool TEEZ maakt gebruik van de rijlesplanner van Dation. Leerlingen kunnen online bekijken hoe ze ervoor staan. Klik op de afbeelding om in te loggen."</em>
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981', marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>
                  2. De Dagelijkse Werkwijze van de Rijschool
                </h4>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
                  <li><strong>Kandidaat meldt zich aan:</strong> Via het formulier op de website (WPForms ID 301).</li>
                  <li><strong>E-mailnotificatie:</strong> Het formulier verzond direct een e-mail naar <code>info@rijschoolteez.nl</code> (map <code>INBOX/aanmeldingen</code>).</li>
                  <li><strong>Invoer in Dation:</strong> De instructeur/eigenaar (Fardin) opende Dation Rijlesplanner en voerde de kandidaat in als nieuwe leerling.</li>
                  <li><strong>Leerling App:</strong> De leerling ontving een welkomstmail met inloggegevens voor de Dation RijlesApp om rijlessen in te zien en voortgang te volgen.</li>
                </ol>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 700, color: '#d97706', marginBottom: '6px' }}>
                  3. Hoe onze nieuwe Admin Portal dit versnelt
                </h4>
                <p style={{ margin: 0 }}>
                  In dit nieuwe beheerpaneel hebben we een <strong>"Dation Kopieerknop"</strong> ingebouwd bij elke aanmelding. Eén klik op die knop formatteert alle NAW-gegevens, geboortedatum en pakketkeuze precies zoals Dation het verwacht, zodat je het zonder typefouten direct in Dation kunt plakken.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
                <a
                  href="https://www.rijlesplanner.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={16} /> Open Dation Rijlesplanner
                </a>
                <a
                  href="https://dashboard.dation.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={16} /> Open Dation Dashboard
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & EMAIL NOTIFICATIONS */}
        {activeTab === 'settings' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Bell size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001a33' }}>
                  E-mail- & Webhook Notificaties
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Configureer naar welk e-mailadres nieuwe aanmeldingen verzonden worden.
                </p>
              </div>
            </div>

            {settingsSaved && (
              <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
                ✅ Instellingen succesvol opgeslagen!
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                
                {/* Notification Email */}
                <div className="form-group">
                  <label className="form-label">Ontvangend E-mailadres *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Standaard: <code>info@rijschoolteez.nl</code> (zoals in het originele mailarchief)
                  </div>
                </div>

                {/* Admin PIN */}
                <div className="form-group">
                  <label className="form-label">Admin Beheer Pincode *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={settings.adminPin}
                    onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    De pincode om in te loggen op dit beheerpaneel (bijv. <code>teez2026</code>)
                  </div>
                </div>
              </div>

              {/* Webhook / Mail Dispatcher URL */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">
                  E-mail Webhook / API Dispatcher URL (Optioneel voor live SMTP / Formspree)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://formspree.io/f/xyz of https://api.resend.com/..."
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    className="btn btn--outline"
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} /> Test Notificatie
                  </button>
                </div>
                {testEmailStatus && (
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 600, color: testEmailStatus.includes('✅') ? '#16a34a' : '#2563eb' }}>
                    {testEmailStatus}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                  💡 Zonder webhook worden alle aanvragen automatisch opgeslagen in dit beheerpaneel en kan de instructeur ze in 1 klik beantwoorden via WhatsApp, telefoon of e-mail.
                </div>
              </div>

              {/* Notification Toggles */}
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 700, color: '#001a33', marginBottom: '10px', fontSize: '0.9rem' }}>
                  Actieve Meldingen
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnRegistration}
                      onChange={(e) => setSettings({ ...settings, notifyOnRegistration: e.target.checked })}
                    />
                    Melding bij nieuwe volledige Aanmelding (Pakket A, B, C, TEEZ)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnTrialLesson}
                      onChange={(e) => setSettings({ ...settings, notifyOnTrialLesson: e.target.checked })}
                    />
                    Melding bij nieuwe Proeflesaanvraag
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnContact}
                      onChange={(e) => setSettings({ ...settings, notifyOnContact: e.target.checked })}
                    />
                    Melding bij Terugbelverzoek & Contactberichten
                  </label>
                </div>
              </div>

              <button type="submit" className="btn">
                Instellingen Opslaan
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
