import React from 'react';
import { HeadPage } from '../components/HeadPage';
import { Check } from 'lucide-react';

interface PricesPageProps {
  onNavigate: (page: string, packageChoice?: string) => void;
}

export const PricesPage: React.FC<PricesPageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="Tarieven" onNavigateHome={() => onNavigate('home')} />

      <div className="content price-section">
        <div className="container">
          {/* Authentic Page Content */}
          <div className="article__body" style={{ maxWidth: '850px', margin: '0 auto 40px', textAlign: 'center' }}>
            <p style={{ fontSize: '15.5px', lineHeight: 1.8 }}>
              Rijschool <strong>TEEZ</strong> biedt een gratis intake-les aan. Zo zien wij, hoeveel jij al weet van het autorijden en hoe snel jij informatie oppakt. Aan de hand van deze intake-les wordt een inschatting gemaakt van het aantal nodige lessen.
            </p>
            <p style={{ fontSize: '15px', color: '#64748b', marginTop: '10px' }}>
              Hieronder vind jij de pakketten, die onze autorijschool aanbiedt. De instructeur zal na de intake-les adviseren welk pakket het beste bij jou past. Natuurlijk ben jij helemaal vrij in jouw keuze. Naast de onderstaande pakketten is het ook mogelijk om losse rijlessen af te nemen.
            </p>
          </div>

          {/* Clean Modernized Price Table */}
          <div className="price-cards-grid">
            {/* PAKKET T */}
            <div className="price-card">
              <div className="price-card__header">
                <span className="price-card__tag">Instap</span>
                <h3 className="price-card__title">PAKKET T</h3>
                <div className="price-card__amount">
                  <span className="price-currency">€</span>
                  <span className="price-value">1.550</span>
                </div>
              </div>

              <ul className="price-card__features">
                <li><Check size={16} className="feature-check" /> 20 Rijlessen (60 min)</li>
                <li><Check size={16} className="feature-check" /> Theoriemateriaal</li>
                <li><Check size={16} className="feature-check" /> Tussentijdse toets (TTT)</li>
                <li><Check size={16} className="feature-check" /> CBR Praktijkexamen</li>
                <li><Check size={16} className="feature-check" /> Gratis intakeles</li>
              </ul>

              <button
                type="button"
                className="btn price-card__btn"
                onClick={() => onNavigate('aanmelden', 'Pakket T')}
              >
                Bestel Pakket T
              </button>
            </div>

            {/* PAKKET EE (MEEST GEKOZEN) */}
            <div className="price-card price-card--featured">
              <div className="price-card__badge">
                ★ Meest gekozen ★
              </div>
              <div className="price-card__header">
                <span className="price-card__tag price-card__tag--gold">Aanrader</span>
                <h3 className="price-card__title">PAKKET EE</h3>
                <div className="price-card__amount">
                  <span className="price-currency">€</span>
                  <span className="price-value">2.050</span>
                </div>
              </div>

              <ul className="price-card__features">
                <li><Check size={16} className="feature-check feature-check--gold" /> <strong>30 Rijlessen</strong> (60 min)</li>
                <li><Check size={16} className="feature-check feature-check--gold" /> Theoriemateriaal</li>
                <li><Check size={16} className="feature-check feature-check--gold" /> Tussentijdse toets (TTT)</li>
                <li><Check size={16} className="feature-check feature-check--gold" /> CBR Praktijkexamen</li>
                <li><Check size={16} className="feature-check feature-check--gold" /> Gratis intakeles</li>
              </ul>

              <button
                type="button"
                className="btn price-card__btn price-card__btn--featured"
                onClick={() => onNavigate('aanmelden', 'Pakket EE')}
              >
                Bestel Pakket EE
              </button>
            </div>

            {/* PAKKET Z */}
            <div className="price-card">
              <div className="price-card__header">
                <span className="price-card__tag">Compleet</span>
                <h3 className="price-card__title">PAKKET Z</h3>
                <div className="price-card__amount">
                  <span className="price-currency">€</span>
                  <span className="price-value">2.470</span>
                </div>
              </div>

              <ul className="price-card__features">
                <li><Check size={16} className="feature-check" /> <strong>38 Rijlessen</strong> (60 min)</li>
                <li><Check size={16} className="feature-check" /> Theoriemateriaal</li>
                <li><Check size={16} className="feature-check" /> Tussentijdse toets (TTT)</li>
                <li><Check size={16} className="feature-check" /> CBR Praktijkexamen</li>
                <li><Check size={16} className="feature-check" /> Gratis intakeles</li>
              </ul>

              <button
                type="button"
                className="btn price-card__btn"
                onClick={() => onNavigate('aanmelden', 'Pakket Z')}
              >
                Bestel Pakket Z
              </button>
            </div>
          </div>

          {/* Clean Extra Courses / Losse Rijlessen Block */}
          <div className="extra-rates-card">
            <h3 className="extra-rates-title">Losse Rijlessen & Opfriscursus</h3>
            <p className="extra-rates-desc">
              Prijzen voor losse rijlessen, theorie en opfriscursussen
            </p>
            <div className="extra-rates-grid">
              <div className="extra-rate-item">
                <span className="rate-name">Losse Rijles (60 min)</span>
                <span className="rate-price">€ 55,00</span>
              </div>
              <div className="extra-rate-item">
                <span className="rate-name">Opfriscursus (4x 90 min)</span>
                <span className="rate-price">€ 300,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
