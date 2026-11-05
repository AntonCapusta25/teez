import React from 'react';
import { HeadPage } from '../components/HeadPage';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="Over TEEZ" onNavigateHome={() => onNavigate('home')} />

      <div className="content content-section">
        <div className="container">
          <div className="article__body" style={{ maxWidth: '900px' }}>
            <p>
              Rijschool <strong>TEEZ</strong> is opgericht (begonnen) in 2018. Deze autorijschool is werkzaam in het CBR-examengebied van Enschede en Hengelo. Rijschool <strong>TEEZ</strong> is een eenmansbedrijf. Jij krijgt les van een vaste instructeur. Iedere lesnemer is anders, dat begrijpen wij heel goed. De autorijschool hanteert daarom een persoonlijke benadering. Jij kunt in jouw eigen tempo een rijbewijs halen.
            </p>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap', margin: '25px 0' }}>
              <div style={{ flex: '1 1 500px' }}>
                <p>
                  Cursisten worden door Rijschool TEEZ opgehaald waar zij maar willen. Van een station, de school, het werk of gewoon van huis. De lessen vinden plaats in het gebied Enschede/Hengelo. Zo leert de cursist het gebied goed kennen en ben jij optimaal voorbereid op het praktijkexamen.
                </p>
                <p>
                  Wil jij snel, veilig en verantwoord jouw rijbewijs halen? Daarnaast ook nog veel plezier beleven aan autorijden? Wacht dan niet langer en begin met lessen bij rijschool <strong>TEEZ</strong>!
                </p>
                <div style={{ marginTop: '25px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onNavigate('aanmelden')}
                  >
                    Meld je nu aan
                  </button>
                </div>
              </div>

              <div style={{ flex: '0 0 350px' }}>
                <img
                  src="/images/instructor-car.jpg"
                  alt="Instructeur en lesauto van Rijschool TEEZ"
                  style={{ width: '100%', height: 'auto', borderRadius: '2px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
