import React, { useState } from 'react';
import { X, Phone, CheckCircle, Send } from 'lucide-react';
import { submitContact } from '../lib/supabase';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitContact({
        name,
        email: 'callback-request@rijschoolteez.nl',
        phone,
        message: `Terugbelverzoek ontvangen. Gewenst tijdstip: ${timePreference || 'Zo snel mogelijk'}`,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Er is iets misgegaan bij het verzenden. Bel gerust direct: 06 818 194 84.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Sluiten">
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#001a33', marginBottom: '8px' }}>
          Bel mij terug
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
          Laat je gegevens achter, dan belt de instructeur jou zo spoedig mogelijk terug.
        </p>

        {submitted ? (
          <div className="alert-success" style={{ flexDirection: 'column', textAlign: 'center', padding: '24px' }}>
            <CheckCircle size={36} color="#10b981" />
            <h4 style={{ fontWeight: 700, marginTop: '8px', color: '#065f46' }}>Bedankt voor je aanvraag!</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
              We hebben je terugbelverzoek ontvangen en nemen spoedig contact op.
            </p>
            <button
              type="button"
              className="btn-submit"
              onClick={onClose}
              style={{ marginTop: '16px' }}
            >
              Sluiten
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Naam *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Jouw voor- en achternaam"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefoonnummer *</label>
              <input
                type="tel"
                required
                className="form-input"
                placeholder="Bijv. 06 12345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Voorkeurstijdstip (optioneel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bijv. Vandaag na 17:00 of morgenochtend"
                value={timePreference}
                onChange={(e) => setTimePreference(e.target.value)}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-submit">
              <Send size={16} />
              {submitting ? 'Versturen...' : 'Verstuur terugbelverzoek'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
              Of bel zelf direct:{' '}
              <a href="tel:0681819484" style={{ color: '#001a33', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={14} /> 06 818 194 84
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
