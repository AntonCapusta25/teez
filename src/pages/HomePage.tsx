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
      text: 'Welkom op onze website! Rijschool TEEZ biedt jou de mogelijkheid om snel en voordelig jouw rijbewijs te halen.',
      bg: '/images/hero-car.jpg',
    },
    {
      title: 'Wist je dat..',
      text: '.. Jij bij ons zowel theorie- als praktijklessen kan nemen? Wij zorgen ervoor dat jij goed voorbereid jouw examens in gaat.',
      bg: '/images/car-angle.jpg',
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
                <div className="tiser__title-wrap">
                  <h2 className="tiser__title">{slides[activeSlide].title}</h2>
                </div>
                <div>
                  <p className="tiser__desc">{slides[activeSlide].text}</p>
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
                  <div className="tiser__pager-name">Cursussen</div>
                  <div className="tiser__pager-desc">Theorie en praktijk</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          THE 3 USP BENEFITS (.best)
          ========================================================================== */}
      <section className="best">
        <div className="container">
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

      {/* Intro section */}
      <section style={{ padding: '60px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#001a33', textTransform: 'uppercase', marginBottom: '16px' }}>
              Rijschool TEEZ in Enschede & Hengelo
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', marginBottom: '16px' }}>
              Rijschool <strong>TEEZ</strong> is opgericht in 2018. Deze autorijschool is werkzaam in het CBR-examengebied van Enschede en Hengelo. Cursisten worden opgehaald waar zij maar willen: van station, school, werk of gewoon thuis.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', marginBottom: '24px' }}>
              Wil jij snel, veilig en verantwoord jouw rijbewijs halen? Wacht niet langer en bekijk onze voordelige pakketten!
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => onNavigate('tarieven')}
              >
                Bekijk onze tarieven <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/instructor-car.jpg"
              alt="Instructeur en Hyundai i30 van Rijschool TEEZ"
              style={{ width: '100%', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
