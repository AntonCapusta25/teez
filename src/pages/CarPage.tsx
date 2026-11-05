import React, { useState } from 'react';
import { HeadPage } from '../components/HeadPage';
import { ShieldCheck, Settings, Eye, Wind, Award, Sparkles, X } from 'lucide-react';

interface CarPageProps {
  onNavigate: (page: string) => void;
}

export const CarPage: React.FC<CarPageProps> = ({ onNavigate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; alt: string; title: string } | null>(null);

  const photos = [
    { src: '/images/hero-car.jpg', alt: 'Hyundai i30 Lesauto Rijschool TEEZ schuin vooraanzicht', title: 'Vooraanzicht (3/4)' },
    { src: '/images/car-front.jpg', alt: 'Hyundai i30 Lesauto Rijschool TEEZ vooraanzicht', title: 'Frontale blik' },
    { src: '/images/car-interior.jpg', alt: 'Hyundai i30 Interieur en lescockpit met dubbele bediening', title: 'Interieur & Dubbele bediening' },
    { src: '/images/car-angle.jpg', alt: 'Hyundai i30 zijkant en herkenbare TEEZ bestickering', title: 'Zijaanzicht' },
    { src: '/images/car-back.jpg', alt: 'Hyundai i30 achterkant met L-bord', title: 'Achteraanzicht met L-bord' },
    { src: '/images/car-action.jpg', alt: 'Hyundai i30 lesauto van Rijschool TEEZ onderweg', title: 'Lesauto onderweg in Enschede' },
  ];

  const specs = [
    { icon: <ShieldCheck size={22} color="#ffea00" />, title: 'Dubbele Bediening', desc: 'CBR-goedgekeurde pedalen aan bijrijderszijde voor 100% veiligheid tijdens elke les.' },
    { icon: <Settings size={22} color="#ffea00" />, title: '6-Versnellingsbak', desc: 'Soepel schakelen met een moderne handgeschakelde transmissie, perfect voor je examen.' },
    { icon: <Eye size={22} color="#ffea00" />, title: 'Camera & Sensoren', desc: 'Achteruitrijcamera en parkeersensoren om bijzondere verrichtingen vlot onder de knie te krijgen.' },
    { icon: <Wind size={22} color="#ffea00" />, title: 'Klimaatregeling', desc: 'Automatische airconditioning voor een comfortabele en geconcentreerde leservaring in elk seizoen.' },
    { icon: <Award size={22} color="#ffea00" />, title: 'Veiligheidssystemen', desc: 'Uitgerust met Lane Keeping Assist, Autonomous Emergency Braking en actieve stabiliteitscontrole.' },
    { icon: <Sparkles size={22} color="#ffea00" />, title: 'Schoon & Rookvrij', desc: 'Milieuvriendelijke Euro 6 motor en een gegarandeerd 100% rookvrij, fris interieur.' },
  ];

  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="De lesauto" onNavigateHome={() => onNavigate('home')} />

      <div className="content content-section">
        <div className="container">
          {/* Authentic Intro Text */}
          <div className="article__body" style={{ maxWidth: '850px', marginBottom: '32px' }}>
            <p style={{ fontSize: '16.5px', lineHeight: 1.8 }}>
              Rijden doe je bij <strong>Rijschool TEEZ</strong> in een moderne, veilige en comfortabele <strong>Hyundai i30</strong>. Deze auto staat bekend om zijn prettige en betrouwbare rijeigenschappen, perfecte overzicht en geavanceerde hulpsystemen. Ideaal om snel en met vol vertrouwen je autorijbewijs te halen!
            </p>
          </div>

          {/* Interactive Photo Gallery */}
          <div style={{ marginBottom: '45px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#001a33', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '0.5px' }}>
              Fotogalerij van de Lesauto
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {photos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(p)}
                  style={{
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
                    border: '1px solid #e5f1fc',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    background: '#001a33',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.07)';
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', transition: 'opacity 0.2s' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0, 26, 51, 0.85) 100%)',
                      color: '#ffffff',
                      padding: '20px 14px 10px',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {p.title}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px', textAlign: 'right' }}>
              💡 Klik op een foto om deze te vergroten
            </p>
          </div>

          {/* Vehicle Specifications Card */}
          <div
            style={{
              backgroundColor: '#001a33',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '40px 32px',
              marginBottom: '45px',
              boxShadow: '0 12px 30px rgba(0, 26, 51, 0.15)',
            }}
          >
            <div style={{ maxWidth: '650px', marginBottom: '30px' }}>
              <span style={{ backgroundColor: '#ffea00', color: '#001a33', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Specificaties & Veiligheid
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '10px' }}>
                Hyundai i30 — Ontworpen voor optimaal lesgemak
              </h3>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, marginTop: '8px' }}>
                Alles in de lesauto is afgestemd op comfort, helder zicht rondom en de hoogste veiligheidseisen van het CBR.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {specs.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>{s.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffea00', marginBottom: '4px' }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '30px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#001a33' }}>
                Klaar om plaats te nemen achter het stuur?
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                Ervaar het zelf tijdens een vrijblijvende intake- en proefles met instructeur Fawad.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                onClick={() => onNavigate('home')}
              >
                Vraag proefles aan
              </button>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onNavigate('tarieven')}
              >
                Bekijk tarieven
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedPhoto(null)}
          style={{ padding: '20px', cursor: 'pointer' }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '850px', width: '100%', padding: '16px', background: '#001a33', color: '#fff', borderRadius: '8px', cursor: 'default' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#ffea00' }}>
                {selectedPhoto.title}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                aria-label="Sluiten"
              >
                <X size={22} />
              </button>
            </div>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
