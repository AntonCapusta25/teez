import React from 'react';
import { ExternalLink, Phone, Mail, MapPin, ArrowUp, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, packageChoice?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: string, packageChoice?: string) => {
    onNavigate(page, packageChoice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* 1. Clean Partner / Authority Section */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-grid">
            {/* Card 1: Dation */}
            <div className="partner-card">
              <div className="partner-card__logo-wrap">
                <a
                  href="https://www.rijlesplanner.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ga naar Dation Rijlesplanner"
                >
                  <img
                    src="/images/dation.png"
                    alt="Dation Rijlesplanner"
                    className="partner-card__logo"
                  />
                </a>
              </div>
              <div className="partner-card__content">
                <h4 className="partner-card__title">DATION | RIJLESPLANNER</h4>
                <p className="partner-card__text">
                  Rijschool <strong>TEEZ</strong> maakt gebruik van de rijlesplanner van Dation. Leerlingen kunnen online bekijken hoe ze ervoor staan.
                </p>
                <a
                  href="https://www.rijlesplanner.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-card__link"
                >
                  Inloggen bij Dation <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Card 2: CBR */}
            <div className="partner-card">
              <div className="partner-card__logo-wrap">
                <a
                  href="https://www.cbr.nl/nl/rijbewijs-halen/auto/praktijkexamen-auto/je-rijschool-machtigen.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="CBR Rijschool Machtigen"
                >
                  <img
                    src="/images/cbr.png"
                    alt="CBR Logo"
                    className="partner-card__logo"
                  />
                </a>
              </div>
              <div className="partner-card__content">
                <h4 className="partner-card__title">RIJSCHOOL MACHTIGEN</h4>
                <p className="partner-card__text">
                  Om rijschool TEEZ toestemming te geven om een praktijkexamen voor je aan te vragen, moet je de rijschool machtigen (Rijschoolnummer: <strong>2098W1</strong>).
                </p>
                <a
                  href="https://www.cbr.nl/nl/rijbewijs-halen/auto/praktijkexamen-auto/je-rijschool-machtigen.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-card__link"
                >
                  Instructies bij CBR <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Footer in Authentic Site Brand Navy (#001a33) */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: About */}
            <div className="footer-col footer-col--about">
              <h4 className="footer-title">OVER RIJSCHOOL TEEZ</h4>
              <p className="footer-text">
                Rijschool <strong>TEEZ</strong> is een erkende autorijschool werkzaam in het CBR-examengebied van Enschede en Hengelo. Met een vaste instructeur, persoonlijke begeleiding en scherpe pakketten haal je veilig en snel je rijbewijs.
              </p>
              <div className="footer-logo">
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="footer-logo-wrap"
                  style={{ border: 'none', cursor: 'pointer' }}
                  title="Rijschool TEEZ Home"
                >
                  <img
                    src="/images/logo.png"
                    alt="Rijschool TEEZ"
                    className="footer-logo__img"
                  />
                </button>
              </div>
              <div className="footer-social">
                <a
                  href="https://www.facebook.com/RijschoolTEEZ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social__link"
                  aria-label="Facebook"
                  title="Volg ons op Facebook"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/31681819484?text=Hallo%20Rijschool%20TEEZ,%20ik%20heb%20een%20vraag%20over%20rijlessen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social__link footer-social__link--wa"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <a
                  href="tel:0681819484"
                  className="footer-social__link"
                  aria-label="Telefoon"
                  title="Bel ons direct"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>

            {/* Col 2: Snelle Links */}
            <div className="footer-col footer-col--nav">
              <h4 className="footer-title">SNELLE LINKS</h4>
              <ul className="footer-nav">
                <li>
                  <button type="button" onClick={() => handleNav('home')}>
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('over-teez')}>
                    Over TEEZ
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('tarieven')}>
                    Tarieven & Pakketten
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('de-lesauto')}>
                    De lesauto (Hyundai i30)
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('aanmelden')}>
                    Aanmelden
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('faq')}>
                    Veelgestelde vragen
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNav('contact')}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Bedrijfsgegevens */}
            <div className="footer-col footer-col--contact">
              <h4 className="footer-title">BEDRIJFSGEGEVENS</h4>
              <div className="footer-company-info">
                <p className="company-name">Rijschool TEEZ</p>
                <p className="company-addr">
                  <MapPin size={14} className="info-icon" />
                  Hezingenbrink 5, 7544HE Enschede
                </p>
                <p className="company-tel">
                  <Phone size={14} className="info-icon" />
                  <strong>T:</strong>{' '}
                  <a href="tel:0681819484">06 818 194 84</a>
                </p>
                <p className="company-email">
                  <Mail size={14} className="info-icon" />
                  <strong>E:</strong>{' '}
                  <a href="mailto:info@rijschoolteez.nl">info@rijschoolteez.nl</a>
                </p>
                <div className="company-registration">
                  <span>CBR Rijschoolnummer: 2098W1</span>
                  <span>KvK-nummer: 70703124</span>
                  <span>BTW-id: NL002329386B15</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Copyright Bar */}
          <div className="footer-bottom">
            <p className="copyright-text">
              © {new Date().getFullYear()} Rijschool TEEZ. Alle rechten voorbehouden.
              <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
              <button
                type="button"
                onClick={() => handleNav('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  opacity: 0.5,
                  fontSize: '0.8rem',
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px'
                }}
                title="Beheerportaal voor instructeurs"
              >
                Beheerportaal
              </button>
            </p>
            <button
              type="button"
              className="scroll-top-btn"
              onClick={scrollToTop}
              title="Terug naar boven"
            >
              <span>Naar boven</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
