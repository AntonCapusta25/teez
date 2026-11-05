import React from 'react';
import { HeadPage } from '../components/HeadPage';
import {
  CheckCircle2,
  UserCheck,
  MapPin,
  Compass,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Car,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="about-page">
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="Over TEEZ" onNavigateHome={() => onNavigate('home')} />

      <div className="container">
        {/* 1. Intro Section: Story & Instructor Spotlight */}
        <section className="about-intro-section">
          <div className="about-intro-grid">
            {/* Left Column: Authentic Story & Philosophy */}
            <div className="about-story">
              <span className="about-badge">
                <ShieldCheck size={14} color="#001a33" />
                CBR Rijschoolnummer 2098W1 • Actief sinds 2018
              </span>

              <h2 className="about-heading">
                Rijden met rust, vertrouwen en een vaste instructeur
              </h2>

              <p className="about-lead">
                Rijschool <strong>TEEZ</strong> is in 2018 opgericht in Twente. Als zelfstandig eenmansbedrijf geloven wij in één duidelijke kracht: <strong>persoonlijke aandacht zonder gedoe</strong>.
              </p>

              <p className="about-text">
                Iedere leerling leert anders. De één stapt vol bravoure achter het stuur en heeft aan een compact pakket genoeg, terwijl de ander wat meer tijd nodig heeft of kampt met spanning en faalangst. Bij ons ben je geen nummer in een groot bestand. Je lest altijd bij dezelfde instructeur, in je eigen tempo en met een lesplan dat precies op jouw niveau aansluit.
              </p>

              <ul className="about-checklist">
                <li className="about-checklist-item">
                  <CheckCircle2 size={18} className="about-checklist-icon" />
                  <span><strong>Altijd dezelfde instructeur (Fawad)</strong> — Vertrouwd en deskundig, elke les opnieuw.</span>
                </li>
                <li className="about-checklist-item">
                  <CheckCircle2 size={18} className="about-checklist-icon" />
                  <span><strong>Flexibele ophaalservice</strong> — Thuis, station, werk, Saxion, ROC of Universiteit Twente.</span>
                </li>
                <li className="about-checklist-item">
                  <CheckCircle2 size={18} className="about-checklist-icon" />
                  <span><strong>Officiële CBR-examenroutes</strong> — Lessen in Enschede &amp; Hengelo voor optimale voorbereiding.</span>
                </li>
                <li className="about-checklist-item">
                  <CheckCircle2 size={18} className="about-checklist-icon" />
                  <span><strong>Geduld &amp; rust</strong> — Fouten maken mag, ontspannen sfeer gegarandeerd.</span>
                </li>
              </ul>

              <div style={{ marginTop: '10px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onNavigate('aanmelden')}
                >
                  <span>Meld je nu aan</span>
                  <ArrowRight size={16} style={{ marginLeft: '8px' }} />
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

            {/* Right Column: Instructor & Car Profile Card */}
            <div className="about-instructor-card">
              <div className="about-instructor-media">
                <img
                  src="/images/instructor-car.jpg"
                  alt="Fawad - Rijinstructeur en eigenaar Rijschool TEEZ met Hyundai i30"
                  className="about-instructor-img"
                />
                <span className="about-instructor-pill">
                  <Sparkles size={14} />
                  <span>Vaste Instructeur</span>
                </span>
              </div>

              <div className="about-instructor-body">
                <h3 className="about-instructor-name">Fawad</h3>
                <p className="about-instructor-role">Gediplomeerd WRM-Rijinstructeur &amp; Eigenaar</p>

                <div className="about-instructor-meta-grid">
                  <div className="about-instructor-meta-item">
                    <span className="about-instructor-meta-label">Werkgebied</span>
                    <span className="about-instructor-meta-value">Enschede, Hengelo &amp; Twente</span>
                  </div>
                  <div className="about-instructor-meta-item">
                    <span className="about-instructor-meta-label">CBR Nummer</span>
                    <span className="about-instructor-meta-value">2098W1</span>
                  </div>
                  <div className="about-instructor-meta-item">
                    <span className="about-instructor-meta-label">Actief sinds</span>
                    <span className="about-instructor-meta-value">2018</span>
                  </div>
                  <div className="about-instructor-meta-item">
                    <span className="about-instructor-meta-label">Lesauto</span>
                    <span className="about-instructor-meta-value">Hyundai i30 (1.4 Turbo)</span>
                  </div>
                </div>

                <p className="about-instructor-quote">
                  "Een rijbewijs haal je voor het leven. Mijn doel is niet alleen dat je slaagt bij het CBR, maar dat je met zelfvertrouwen en écht plezier veilig de weg op gaat."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Pillars Section: De 4 Beloften van TEEZ */}
        <section className="about-pillars-section">
          <div className="about-section-header">
            <span className="about-section-kicker">Waarom Rijschool TEEZ</span>
            <h2 className="about-section-title">De 4 Beloften van Rijschool TEEZ</h2>
            <p className="about-section-desc">
              Wij doen geen loze beloftes, maar zorgen voor een duidelijke, eerlijke en prettige rijopleiding van a tot z.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <UserCheck size={24} />
              </div>
              <h3 className="about-pillar-title">1 Vaste Instructeur</h3>
              <p className="about-pillar-desc">
                Geen wisselingen of verwarring. Fawad kent jouw voortgang, sterke punten en leertempo door en door.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <MapPin size={24} />
              </div>
              <h3 className="about-pillar-title">Ophalen Waar Jij Wilt</h3>
              <p className="about-pillar-desc">
                Start je les thuis, bij het station, Saxion, UTwente, ROC of op je werkplek in Enschede en Hengelo.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <Compass size={24} />
              </div>
              <h3 className="about-pillar-title">Focus op CBR Examens</h3>
              <p className="about-pillar-desc">
                Rijd direct in het officiële examengebied. Alle lastige kruispunten en routes worden grondig geoefend.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <HeartHandshake size={24} />
              </div>
              <h3 className="about-pillar-title">Geduld &amp; Faalangst</h3>
              <p className="about-pillar-desc">
                Lessen in een veilige, rustige sfeer. Geen stress of stemverheffing; ideaal voor wie zenuwachtig is.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Steps Roadmap: Hoe werkt het bij TEEZ? */}
        <section className="about-steps-section">
          <div className="about-section-header">
            <span className="about-section-kicker">Jouw Traject</span>
            <h2 className="about-section-title">In 4 Stappen naar je Rijbewijs</h2>
            <p className="about-section-desc">
              Van je allereerste kennismaking tot het moment dat je met je rijbewijs in handen het CBR uitloopt.
            </p>
          </div>

          <div className="about-steps-grid">
            <div className="about-step-card">
              <span className="about-step-number">1</span>
              <h3 className="about-step-title">Vrijblijvende Proefles</h3>
              <p className="about-step-desc">
                Ervaar de sfeer, maak kennis met Fawad en de auto en ontvang een eerlijk advies over je lesbehoefte.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-number">2</span>
              <h3 className="about-step-title">Persoonlijk Lesplan</h3>
              <p className="about-step-desc">
                Kies een voordelig pakket of losse lessen op tijden die jou schikken, inclusief avonden en zaterdagen.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-number">3</span>
              <h3 className="about-step-title">Tussentijdse Toets</h3>
              <p className="about-step-desc">
                Wennen aan de examensituatie bij het CBR en alvast vrijstelling verdienen voor de bijzondere verrichtingen.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-number">4</span>
              <h3 className="about-step-title">CBR Praktijkexamen</h3>
              <p className="about-step-desc">
                Optimaal voorbereid en vol zelfvertrouwen het examen in Enschede rijden. Gefeliciteerd met je pasje!
              </p>
            </div>
          </div>
        </section>

        {/* 4. Car Spotlight Banner */}
        <section className="about-car-section">
          <div className="about-car-banner">
            <div className="about-car-media">
              <img
                src="/images/car-action.jpg"
                alt="Moderne Hyundai i30 lesauto van Rijschool TEEZ op de weg"
                className="about-car-img"
              />
            </div>

            <div className="about-car-content">
              <span className="about-badge" style={{ alignSelf: 'flex-start' }}>
                <Car size={14} color="#001a33" />
                De Lesauto
              </span>

              <h3 className="about-car-title">
                Veilig en comfortabel leren in de Hyundai i30
              </h3>

              <p className="about-car-desc">
                Je lest in een sportieve, overzichtelijke en moderne Hyundai i30 met turbo motor. Uitgerust met de nieuwste veiligheidssystemen, achteruitrijcamera, soepele schakelbak en dubbele bediening.
              </p>

              <div className="about-car-chips">
                <span className="about-car-chip">Handgeschakeld 6-bak</span>
                <span className="about-car-chip">Achteruitrijcamera</span>
                <span className="about-car-chip">Parkeersensoren</span>
                <span className="about-car-chip">Climate Control</span>
                <span className="about-car-chip">Dubbele Bediening</span>
                <span className="about-car-chip">Altijd Schoon &amp; Rookvrij</span>
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => onNavigate('de-lesauto')}
                  style={{ minHeight: '44px', padding: '10px 18px', fontSize: '13px' }}
                >
                  <span>Meer over de lesauto</span>
                  <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. High-Impact CTA Card */}
        <div className="about-cta-card">
          <h2 className="about-cta-title">
            Klaar om te beginnen met rijlessen in Enschede &amp; Hengelo?
          </h2>
          <p className="about-cta-desc">
            Neem vandaag nog de eerste stap naar jouw rijbewijs. Plan direct je proefles in of stel je vragen aan Fawad.
          </p>
          <div className="about-cta-btns">
            <button
              type="button"
              className="btn"
              onClick={() => onNavigate('aanmelden')}
            >
              Gratis Proefles Aanvragen
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => onNavigate('contact')}
              style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)' }}
            >
              Stel een vraag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
