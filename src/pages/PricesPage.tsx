import React, { useState, useEffect } from 'react';
import { HeadPage } from '../components/HeadPage';
import { Check, Star } from 'lucide-react';
import { getPricingData, formatEuro } from '../lib/packageStore';

interface PricesPageProps {
  onNavigate: (page: string, packageChoice?: string) => void;
}

export const PricesPage: React.FC<PricesPageProps> = ({ onNavigate }) => {
  const [pricing, setPricing] = useState(() => getPricingData());

  useEffect(() => {
    const handleUpdate = () => {
      setPricing(getPricingData());
    };
    window.addEventListener('teez_pricing_updated', handleUpdate);
    return () => window.removeEventListener('teez_pricing_updated', handleUpdate);
  }, []);

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

          {/* Dynamic Price Table */}
          <div className="price-cards-grid">
            {pricing.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`price-card ${pkg.popular ? 'price-card--featured' : ''}`}
              >
                {pkg.popular && (
                  <div className="price-card__badge">
                    ★ Meest gekozen ★
                  </div>
                )}
                <div className="price-card__header">
                  <span className={`price-card__tag ${pkg.popular ? 'price-card__tag--gold' : ''}`}>
                    {pkg.tag}
                  </span>
                  <h3 className="price-card__title">{pkg.name}</h3>
                  <div className="price-card__amount">
                    <span className="price-currency">€</span>
                    <span className="price-value">{formatEuro(pkg.price)}</span>
                  </div>
                </div>

                <ul className="price-card__features">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check
                        size={16}
                        className={`feature-check ${pkg.popular ? 'feature-check--gold' : ''}`}
                      />{' '}
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`btn price-card__btn ${pkg.popular ? 'price-card__btn--featured' : ''}`}
                  onClick={() => onNavigate('aanmelden', pkg.id)}
                >
                  Bestel {pkg.id}
                </button>

                {pkg.popular && (
                  <div className="price-card__stars" style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '14px', color: '#ffea00' }}>
                    <Star size={16} fill="#ffea00" />
                    <Star size={16} fill="#ffea00" />
                    <Star size={16} fill="#ffea00" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Clean Extra Courses / Losse Rijlessen Block */}
          <div className="extra-rates-card">
            <h3 className="extra-rates-title">Losse Rijlessen & Examens</h3>
            <p className="extra-rates-desc">
              Prijzen voor losse rijlessen, toetsen en praktijkexamens
            </p>
            <div className="extra-rates-grid">
              <div className="extra-rate-item">
                <span className="rate-name">Losse Rijles (60 min)</span>
                <span className="rate-price">€ {formatEuro(pricing.singleRates.hourlyRate)},-</span>
              </div>
              <div className="extra-rate-item">
                <span className="rate-name">Losse Rijles (90 min)</span>
                <span className="rate-price">€ {formatEuro(pricing.singleRates.rate90Min)}</span>
              </div>
              <div className="extra-rate-item">
                <span className="rate-name">CBR Praktijkexamen B</span>
                <span className="rate-price">€ {formatEuro(pricing.singleRates.cbrExam)},-</span>
              </div>
              <div className="extra-rate-item">
                <span className="rate-name">Tussentijdse Toets (TTT)</span>
                <span className="rate-price">€ {formatEuro(pricing.singleRates.tttExam)},-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
