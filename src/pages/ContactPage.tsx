import React, { useState } from 'react';
import { HeadPage } from '../components/HeadPage';
import { MapPin, Phone, Mail, FileText, Send, CheckCircle } from 'lucide-react';
import { submitContact } from '../lib/supabase';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitContact({
        name,
        email,
        phone,
        message,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Er is iets misgegaan bij het verzenden. Bel ons gerust direct op 06 818 194 84.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="Contact" onNavigateHome={() => onNavigate('home')} />

      <div className="content content-section">
        <div className="container">
          <div className="article__body" style={{ maxWidth: '900px', marginBottom: '35px' }}>
            <p>
              Wil jij meer informatie over <strong>Rijschool TEEZ</strong>? Vul dan onderstaand formulier in. Aanmelden bij onze rijschool kan via de pagina{' '}
              <button
                type="button"
                onClick={() => onNavigate('aanmelden')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#0284c7',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                'Aanmelden'
              </button>
              . Bekijk ook eens de pagina{' '}
              <button
                type="button"
                onClick={() => onNavigate('faq')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#0284c7',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                'FAQ'
              </button>{' '}
              voor veel gestelde vragen.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Direct contact info & Google Map */}
            <div>
              <div
                style={{
                  background: '#001a33',
                  color: '#ffffff',
                  padding: '30px',
                  borderRadius: '2px',
                  marginBottom: '25px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    marginBottom: '16px',
                    color: '#ffea00',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Rijschool TEEZ
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={18} color="#ffea00" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>
                      Hezingenbrink 5<br />
                      7544HE, Enschede
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={18} color="#ffea00" style={{ flexShrink: 0 }} />
                    <a href="tel:0681819484" style={{ color: '#ffffff', fontWeight: 700 }}>
                      06 818 194 84
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={18} color="#ffea00" style={{ flexShrink: 0 }} />
                    <a href="mailto:info@rijschoolteez.nl" style={{ color: '#ffffff', fontWeight: 700 }}>
                      info@rijschoolteez.nl
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="#ffea00" />
                    <span>CBR Rijschoolnummer: <strong style={{ color: '#ffffff' }}>2098W1</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="#ffea00" />
                    <span>KvKnr: <strong style={{ color: '#ffffff' }}>70703124</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="#ffea00" />
                    <span>BTW-id: <strong style={{ color: '#ffffff' }}>NL002329386B15</strong></span>
                  </div>
                </div>
              </div>

              {/* Authentic Google Maps embed from WordPress post 81 */}
              <div
                style={{
                  border: '1px solid #d9e2eb',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  lineHeight: 0,
                  boxShadow: '0 2px 12px rgba(81, 127, 160, 0.08)',
                }}
              >
                <iframe
                  title="Locatie Rijschool TEEZ Enschede"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.6827761955356!2d6.88130445139457!3d52.19463866794323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b81482fdf4d141%3A0x2b6637fb4b71fd67!2sHezingenbrink+5%2C+7544+HE+Enschede%2C+Nederland!5e0!3m2!1snl!2snl!4v1519714690474"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="form-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '1.25rem', color: '#001a33', fontWeight: 800, marginBottom: '6px' }}>
                Stuur een bericht
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
                Heb je een vraag over rijlessen of wil je iets overleggen? Vul onderstaand formulier in.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <CheckCircle size={52} color="#10b981" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '1.3rem', color: '#001a33', fontWeight: 800, marginBottom: '8px' }}>
                    Bedankt voor je bericht!
                  </h4>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: '0 auto 20px' }}>
                    We hebben jouw bericht ontvangen en nemen zo spoedig mogelijk contact met je op.
                  </p>
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '10px 24px', fontSize: '13px' }}
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                  >
                    Nog een bericht versturen
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
                    <label className="form-label">E-mail *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="jouw@email.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefoonnummer *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="06 12345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bericht *</label>
                    <textarea
                      required
                      className="form-textarea"
                      rows={5}
                      placeholder="Typ hier jouw vraag of opmerking..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn"
                    style={{ padding: '14px 32px', fontSize: '14px', width: '100%' }}
                  >
                    <Send size={15} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    {submitting ? 'Verzenden...' : 'Verstuur Bericht'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
