import React, { useState } from 'react';
import { MapPin, Phone, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCallback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenCallback,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'over-teez', label: 'Over TEEZ' },
    { id: 'tarieven', label: 'Tarieven' },
    { id: 'de-lesauto', label: 'De lesauto' },
    { id: 'aanmelden', label: 'Aanmelden' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header>
      {/* Top Bar (.bar-social) */}
      <div className="bar-social">
        <div className="container bar-social__inner">
          <p className="bar-social__text">
            Lessen vanaf € 55,- per uur, voordelige pakketten!
          </p>
          <div className="bar-social__links">
            <a
              href="https://www.facebook.com/RijschoolTEEZ/"
              target="_blank"
              rel="noopener noreferrer"
              title="Volg Rijschool TEEZ op Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Branding Header (.header) */}
      <div className="header">
        <div className="container header__inner">
          <div className="logo">
            <button
              onClick={() => handleNavClick('home')}
              className="logo__link"
              style={{ background: 'none' }}
            >
              <img
                src="/images/logo.png"
                alt="Rijschool TEEZ Logo"
                className="logo__img"
              />
            </button>
          </div>

          <div className="header__contacts">
            <div className="header__contact-item">
              <MapPin size={18} />
              <span>Enschede, Nederland</span>
            </div>

            <div className="header__contact-item">
              <Phone size={18} />
              <a href="tel:0681819484">06 818 194 84</a>
            </div>

            <button
              type="button"
              className="btn header__callback"
              onClick={onOpenCallback}
            >
              Bel mij
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar (.nav) */}
      <nav className="nav">
        <div className="container nav__inner">
          <button
            type="button"
            className="nav__mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {mobileMenuOpen ? 'Sluit menu' : 'Menu'}
            </span>
          </button>

          <div className="nav__mobile-cta">
            <button
              type="button"
              className="nav__proefles-btn"
              onClick={() => handleNavClick('aanmelden')}
            >
              Gratis Proefles
            </button>
          </div>

          <ul className={`nav__list ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id} className="nav__item">
                <button
                  type="button"
                  className={currentPage === item.id ? 'active' : ''}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav__cta-desktop">
            <button
              type="button"
              className="nav__proefles-btn"
              onClick={() => handleNavClick('aanmelden')}
            >
              Gratis Proefles
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
