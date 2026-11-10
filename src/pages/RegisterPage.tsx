import React, { useState, useEffect } from 'react';
import { HeadPage } from '../components/HeadPage';
import { CheckCircle, Send, PhoneCall } from 'lucide-react';
import { submitRegistration } from '../lib/supabase';
import { getPricingData, formatEuro } from '../lib/packageStore';

interface RegisterPageProps {
  initialPackage?: string;
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ initialPackage, onNavigate }) => {
  const [pricing, setPricing] = useState(() => getPricingData());
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Man');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [address, setAddress] = useState('');
  const [postalCity, setPostalCity] = useState('');
  const [packageChoice, setPackageChoice] = useState(initialPackage || 'Pakket EE');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setPricing(getPricingData());
    };
    window.addEventListener('teez_pricing_updated', handleUpdate);
    return () => window.removeEventListener('teez_pricing_updated', handleUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitRegistration({
        full_name: fullName,
        gender,
        email,
        phone,
        birth_date: birthDate,
        birth_place: birthPlace,
        address,
        postal_city: postalCity,
        package_choice: packageChoice,
        notes,
        honeypot,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Er is iets misgegaan bij het verzenden van het formulier. Neem gerust telefonisch contact met ons op via 06 818 194 84.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="Aanmelden" onNavigateHome={() => onNavigate('home')} />

      <div className="content content-section">
        <div className="container">
          <div className="article__body" style={{ maxWidth: '850px', marginBottom: '30px' }}>
            <p>
              Wat leuk! Jij hebt besloten om je aan te melden bij Rijschool <strong>TEEZ</strong>. Wij hebben nog gegevens van jou nodig. Vul onderstaand formulier zo volledig mogelijk in. Bij vragen kun jij contact met ons opnemen. Na aanmelding neemt de instructeur zo spoedig mogelijk contact met jou op.
            </p>
          </div>

          <div className="form-card" style={{ maxWidth: '850px', margin: '0 0 50px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '1.6rem', color: '#001a33', fontWeight: 800, marginBottom: '12px' }}>
                  Bedankt voor je aanmelding bij Rijschool TEEZ!
                </h2>
                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 24px' }}>
                  De instructeur neemt zo spoedig mogelijk telefonisch of per e-mail contact met je op om de kennismaking en je eerste rijles af te stemmen.
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onNavigate('home')}
                >
                  Terug naar home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="alert-error">{error}</div>}

                {/* Anti-spam honeypot */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website_url_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* 1. Persoonsgegevens */}
                <h3 style={{ fontSize: '1.15rem', color: '#001a33', fontWeight: 800, marginBottom: '16px', borderBottom: '2px solid #ffea00', paddingBottom: '6px', display: 'inline-block' }}>
                  1. Persoonsgegevens
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Voor- en achternaam *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Volledige naam"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Geslacht *</label>
                    <div style={{ display: 'flex', gap: '24px', paddingTop: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="gender"
                          value="Man"
                          checked={gender === 'Man'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        Man
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="gender"
                          value="Vrouw"
                          checked={gender === 'Vrouw'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        Vrouw
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
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
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Geboortedatum *</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Geboorteplaats *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Bijv. Enschede"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Adres & Woonplaats */}
                <h3 style={{ fontSize: '1.15rem', color: '#001a33', fontWeight: 800, margin: '24px 0 16px', borderBottom: '2px solid #ffea00', paddingBottom: '6px', display: 'inline-block' }}>
                  2. Adres & Woonplaats
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Adres (straat en huisnummer) *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Straatnaam 12"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postcode + Woonplaats *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="7544 HE Enschede"
                      value={postalCity}
                      onChange={(e) => setPostalCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* 3. Pakketkeuze */}
                <h3 style={{ fontSize: '1.15rem', color: '#001a33', fontWeight: 800, margin: '24px 0 16px', borderBottom: '2px solid #ffea00', paddingBottom: '6px', display: 'inline-block' }}>
                  3. Pakketkeuze
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                  Kies het gewenste rijlespakket. Aanmelden voor de GRATIS intakeles kan ook via de homepagina.
                </p>

                <div className="form-group">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {pricing.packages.map((pkg) => (
                      <label
                        key={pkg.id}
                        style={{
                          display: 'block',
                          padding: '16px',
                          border: packageChoice === pkg.id ? '2px solid #ffea00' : '1px solid #d9e2eb',
                          borderRadius: '2px',
                          background: packageChoice === pkg.id ? '#fffde7' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                        }}
                      >
                        {pkg.popular && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '12px',
                              background: '#ffea00',
                              color: '#001a33',
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Meest gekozen
                          </span>
                        )}
                        <input
                          type="radio"
                          name="package_choice"
                          value={pkg.id}
                          checked={packageChoice === pkg.id}
                          onChange={(e) => setPackageChoice(e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <strong style={{ fontSize: '15px', color: '#001a33' }}>{pkg.id}</strong>
                        <div style={{ fontSize: '16px', color: '#001a33', fontWeight: 800, margin: '4px 0 2px' }}>
                          € {formatEuro(pkg.price)}
                        </div>
                        <small style={{ color: '#64748b', fontSize: '12px' }}>
                          {pkg.desc || `${pkg.lessons} rijlessen + examens`}
                        </small>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Overige opmerkingen */}
                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label className="form-label">Overige opmerkingen</label>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px' }}>
                    Let op: Als je algemene vragen hebt voor de rijschool en je wilt je (nog) niet inschrijven, maak dan gebruik van het formulier op de pagina "Contact".
                  </p>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Eventuele opmerkingen of bijzonderheden..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '28px' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn"
                    style={{ padding: '16px 36px', fontSize: '15px' }}
                  >
                    <Send size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    {submitting ? 'Aanmelding versturen...' : 'Aanmelden'}
                  </button>
                </div>

                <div style={{ marginTop: '20px', color: '#64748b', fontSize: '13px' }}>
                  Liever direct telefonisch overleg? Bel ons op{' '}
                  <a href="tel:0681819484" style={{ color: '#001a33', fontWeight: 700 }}>
                    <PhoneCall size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> 06 818 194 84
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
