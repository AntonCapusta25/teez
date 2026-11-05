import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Car, Navigation, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { submitTrialLesson } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Slider state
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Autorijbewijs halen?',
      text: 'Welkom op onze website! Rijschool TEEZ biedt jou de mogelijkheid om snel en voordelig jouw rijbewijs te halen in Enschede & Hengelo.',
      bg: '/images/hero-car.jpg',
    },
    {
      title: 'Moderne Hyundai i30',
      text: 'Veilig en vertrouwd lessen in een moderne Hyundai i30 voorzien van dubbele bediening, airconditioning en achteruitrijcamera.',
      bg: '/images/car-action.jpg',
    },
  ];

  // Gentle 7s auto-advance with slide looping
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Proefles form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitTrialLesson({
        name,
        email,
        phone,
        preferred_date: preferredDate,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Er is iets misgegaan bij het versturen. Probeer het opnieuw of bel ons direct.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* ==========================================================================
          HERO SLIDER (.tiser) & FORM (.tiser__form)
          ========================================================================== */}
      <section className="tiser">
        <div className="tiser__slider-stage">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`tiser__slide-bg ${activeSlide === idx ? 'active' : ''}`}
              style={{ backgroundImage: `url('${s.bg}')` }}
            />
          ))}
          <div className="tiser__overlay" />
          <div className="container tiser__content">
            <div className="tiser__body">
              <div className="tiser__body-inner">
                <div className="tiser__location-text">
                  Autorijschool in Enschede &amp; Hengelo
                </div>
                <div className="tiser__title-wrap">
                  <h2 className="tiser__title">{slides[activeSlide].title}</h2>
                </div>
                <div>
                  <p className="tiser__desc">{slides[activeSlide].text}</p>
                </div>
                <div className="tiser__trust-row">
                  <span className="tiser__trust-pill">
                    <CheckCircle size={14} color="#ffea00" /> CBR Rijschool 2098W1
                  </span>
                  <span className="tiser__trust-pill">
                    <CheckCircle size={14} color="#ffea00" /> 100% Vaste Instructeur
                  </span>
                  <span className="tiser__trust-pill">
                    <CheckCircle size={14} color="#ffea00" /> Ophalen in heel Twente
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Form (.tiser__find) */}
            <div className="tiser__form-wrap">
              <form className="tiser__form" onSubmit={handleTrialSubmit}>
                <h3 className="form__title">
                  Schrijf je nu in voor een <br />
                  <span className="form__mark">
                    <span className="form__mark-text">Gratis proefles!</span>
                  </span>
                </h3>

                <p className="form__desc">
                  Tijdens een proefles ga jij met de instructeur een stuk rijden. Hij bekijkt hoe veel jij al weet van het autorijden. Hoe snel jij informatie oppakt en hoe jij jezelf voelt in het verkeer.
                </p>

                {submitted ? (
                  <div className="alert-success" style={{ textAlign: 'center' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontWeight: 800 }}>Inschrijving ontvangen!</h4>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                      Bedankt {name}! De instructeur neemt zo spoedig mogelijk contact met jou op.
                    </p>
                    <button
                      type="button"
                      className="btn btn-form-submit"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setPreferredDate('');
                      }}
                    >
                      Nieuwe aanvraag
                    </button>
                  </div>
                ) : (
                  <div>
                    {error && <div className="alert-error">{error}</div>}

                    <div className="control-group">
                      <span className="control-remark">
                        <User size={18} />
                      </span>
                      <input
                        className="inp__control"
                        type="text"
                        required
                        placeholder="Vul jouw naam in"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="control-group">
                      <span className="control-remark">
                        <Mail size={18} />
                      </span>
                      <input
                        className="inp__control"
                        type="email"
                        required
                        placeholder="Vul jouw e-mail in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="control-group">
                      <span className="control-remark">
                        <Phone size={18} />
                      </span>
                      <input
                        className="inp__control"
                        type="tel"
                        required
                        placeholder="Vul jouw telefoonnummer in"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="control-group">
                      <span className="control-remark">
                        <Calendar size={18} />
                      </span>
                      <input
                        className="inp__control"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        title="Geef bij datum de gewenste dag aan voor de proefles"
                      />
                    </div>
                    <small style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '14px' }}>
                      * Geef bij datum de gewenste dag aan voor de proefles
                    </small>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-form-submit"
                    >
                      {submitting ? 'Versturen...' : 'Aanmelden'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Docked Horizontal Bottom Pager Tabs (.tiser__pager) */}
        <div className="tiser__pager">
          <div className="container">
            <div className="tiser__pager-list">
              <button
                type="button"
                className={`tiser__pager-item ${activeSlide === 0 ? 'active' : ''}`}
                onClick={() => setActiveSlide(0)}
              >
                <Car size={32} className="tiser__pager-icon" />
                <div style={{ textAlign: 'left' }}>
                  <div className="tiser__pager-name">Welkom</div>
                  <div className="tiser__pager-desc">Rijschool TEEZ</div>
                </div>
              </button>

              <button
                type="button"
                className={`tiser__pager-item ${activeSlide === 1 ? 'active' : ''}`}
                onClick={() => setActiveSlide(1)}
              >
                <Navigation size={32} className="tiser__pager-icon" />
                <div style={{ textAlign: 'left' }}>
                  <div className="tiser__pager-name">De Lesauto</div>
                  <div className="tiser__pager-desc">Hyundai i30 & Cursussen</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          THE 3 USP BENEFITS (.best) - CENTERED & WIDER
          ========================================================================== */}
      <section className="best">
        <div className="best__container">
          <div className="best__title">
            <h2 className="title">
              <span className="title__mark">De voordelen van </span>
              Rijschool TEEZ
            </h2>
          </div>

          <ul className="best__list">
            <li className="best__item">
              <div className="best__male">
                <User size={30} />
              </div>
              <h3 className="best__item-title">Vaste instructeur</h3>
              <p className="best__item-desc">
                Jij krijgt les van een vaste instructeur. Door een persoonlijke aanpak ontstaat er vertrouwen en begrip. De lessen verlopen daardoor soepeler.
              </p>
            </li>

            <li className="best__item">
              <div className="best__male">
                <Navigation size={30} />
              </div>
              <h3 className="best__item-title">Flexibele tijden</h3>
              <p className="best__item-desc">
                Jij hebt het druk. Dat snappen wij. Wij zijn flexibel in het plannen van jouw rijlessen. Zo is het mogelijk om ’s avonds of op zaterdag te lessen.
              </p>
            </li>

            <li className="best__item">
              <div className="best__male">
                <Award size={30} />
              </div>
              <h3 className="best__item-title">Betaal in termijnen</h3>
              <p className="best__item-desc">
                Jij kunt bij ons lespakketten in termijnen afrekenen tegen 0% rente! Vraag de instructeur naar de mogelijkheden.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ==========================================================================
          EXPANDED HOME INTRO & INSTRUCTOR SECTION (.home-intro)
          ========================================================================== */}
      <section className="home-intro">
        <div className="home-intro__container">
          <div className="home-intro__grid">
            <div>
              <h2 className="home-intro__title">
                Rijschool TEEZ in Enschede & Hengelo
              </h2>
              <p className="home-intro__text">
                Bij Rijschool <strong>TEEZ</strong> stap je altijd in bij dezelfde vaste instructeur: <strong>Fawad</strong>. Vanaf jouw allereerste proefles tot aan het CBR-praktijkexamen heb je één vertrouwd aanspreekpunt dat jouw vorderingen nauwgezet volgt en jouw leertempo respecteert.
              </p>
              <p className="home-intro__text">
                Geen steeds wisselende instructeurs of vreemde lesauto's, maar een ontspannen, geduldige en veilige lesomgeving. Cursisten worden altijd netjes opgehaald en weer afgezet: bij jouw voordeur, op school, het station of je werk in Enschede, Hengelo en omliggende plaatsen in Twente.
              </p>

              {/* Clean Editorial Specifications Grid (No tacky icons) */}
              <div className="home-intro__specs">
                <div className="home-intro__spec-item">
                  <span className="home-intro__spec-label">Vaste Instructeur</span>
                  <span className="home-intro__spec-value">Fawad</span>
                </div>
                <div className="home-intro__spec-item">
                  <span className="home-intro__spec-label">CBR Rijschoolnummer</span>
                  <span className="home-intro__spec-value">2098W1</span>
                </div>
                <div className="home-intro__spec-item">
                  <span className="home-intro__spec-label">Lesgebied</span>
                  <span className="home-intro__spec-value">Enschede, Hengelo & Regio Twente</span>
                </div>
                <div className="home-intro__spec-item">
                  <span className="home-intro__spec-label">Lestijden</span>
                  <span className="home-intro__spec-value">Ma t/m Za (ook avonden)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onNavigate('tarieven')}
                >
                  Bekijk onze tarieven <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => onNavigate('aanmelden')}
                >
                  Direct Proefles Aanvragen
                </button>
              </div>
            </div>

            {/* Prominent Square Instructor Photo Showcase with Editorial Caption */}
            <div className="home-intro__photo-card">
              <img
                src="/images/instructor-car.jpg"
                alt="Vaste instructeur Fawad en Hyundai i30 lesauto van Rijschool TEEZ"
                className="home-intro__photo"
              />
              <div className="home-intro__photo-caption">
                <div className="home-intro__photo-name">Instructeur Fawad & Hyundai i30</div>
                <div className="home-intro__photo-tag">CBR 2098W1</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
