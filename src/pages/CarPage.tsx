import React from 'react';
import { HeadPage } from '../components/HeadPage';

interface CarPageProps {
  onNavigate: (page: string) => void;
}

export const CarPage: React.FC<CarPageProps> = ({ onNavigate }) => {
  const photos = [
    { src: '/images/hero-car.jpg', alt: 'Hyundai i30 Lesauto Rijschool TEEZ' },
    { src: '/images/car-front.jpg', alt: 'Hyundai i30 Lesauto Rijschool TEEZ vooraanzicht' },
    { src: '/images/car-angle.jpg', alt: 'Hyundai i30 zijkant' },
    { src: '/images/car-back.jpg', alt: 'Hyundai i30 achterkant' },
  ];

  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="De lesauto" onNavigateHome={() => onNavigate('home')} />

      <div className="content content-section">
        <div className="container">
          <div className="article__body" style={{ maxWidth: '850px' }}>
            <p style={{ fontSize: '16px' }}>
              Op deze pagina volgt binnenkort meer informatie over de lesauto van <strong>Rijschool TEEZ</strong>, de Hyundai i30.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginTop: '30px',
            }}
          >
            {photos.map((p, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  border: '1px solid #e5f1fc',
                }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => onNavigate('home')}
            >
              Vraag proefles aan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
