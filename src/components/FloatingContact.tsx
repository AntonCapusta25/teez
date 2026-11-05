import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-contact-container">
      {isOpen && (
        <div className="floating-contact-menu">
          <div className="floating-contact-header">
            <strong>Vragen over rijles?</strong>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="floating-close-btn"
              aria-label="Sluiten"
            >
              <X size={16} />
            </button>
          </div>
          <p className="floating-contact-desc">
            Neem direct contact op met je vaste instructeur:
          </p>

          <a
            href="https://wa.me/31681819484?text=Hallo%20Rijschool%20TEEZ,%20ik%20heb%20een%20vraag%20over%20rijlessen"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-action-btn floating-action-btn--wa"
          >
            <MessageCircle size={18} />
            <div>
              <span className="action-title">WhatsApp</span>
              <span className="action-sub">Snelste reactie</span>
            </div>
          </a>

          <a
            href="tel:0681819484"
            className="floating-action-btn floating-action-btn--phone"
          >
            <Phone size={18} />
            <div>
              <span className="action-title">Bel direct</span>
              <span className="action-sub">06 818 194 84</span>
            </div>
          </a>
        </div>
      )}

      <button
        type="button"
        className={`floating-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Direct contact opties"
      >
        <span className="pulse-ring"></span>
        <MessageCircle size={24} />
        <span className="floating-btn-label">Vraag stellen</span>
      </button>
    </div>
  );
};
