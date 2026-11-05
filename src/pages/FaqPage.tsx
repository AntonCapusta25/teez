import React, { useState } from 'react';
import { HeadPage } from '../components/HeadPage';
import { ChevronDown, MessageSquare } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (page: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqs = [
    {
      question: 'Vanaf welke leeftijd mag ik beginnen met lessen?',
      answer:
        'Jij kunt al beginnen met het nemen van rijlessen vanaf 16½ jaar (2toDrive). Let op! Pas met 17 jaar mag jij praktijkexamen doen en kun jij het autorijbewijs halen.',
    },
    {
      question: 'Kan ik praktijklessen nemen zonder theoriecertificaat?',
      answer:
        'Dat kan zeker. Wel raden wij aan om jouw theoriecertificaat zo snel mogelijk te halen: wat jij in theorie beheerst, kun jij direct in de praktijk toepassen.',
    },
    {
      question: 'Hoe snel kan ik beginnen met lessen?',
      answer:
        'Wij hebben geen lange wachtlijsten! Jij kunt bij ons doorgaans binnen 2 tot 5 dagen na aanmelding direct beginnen met je eerste rijles.',
    },
    {
      question: 'Hoe lang duren de lessen?',
      answer:
        'Een standaardles bij Rijschool TEEZ duurt 60 minuten. In overleg met de instructeur kunnen blokuren (2 x 60 minuten) worden gepland, wat erg prettig is om snel voortgang te boeken.',
    },
    {
      question: 'Hoe vaak in de week kan ik lessen nemen?',
      answer:
        'In overleg met de instructeur is er veel mogelijk. De rijschool is flexibel in de planning, dus jij kunt zelf jouw gewenste tempo en aantal lessen per week bepalen.',
    },
    {
      question: 'Hoeveel rijlessen heb ik nodig?',
      answer:
        'Dat verschilt per leerling. De lespakketten zijn afgestemd op het gemiddeld aantal lessen dat nodig is. De instructeur zal tijdens de gratis intake-les een eerlijke en heldere inschatting maken.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div>
      {/* Authentic Head Page Banner (.head-page) */}
      <HeadPage title="FAQ" onNavigateHome={() => onNavigate('home')} />

      <div className="content">
        <div className="faq-modern-container">
          {/* Centered Intro */}
          <div className="faq-intro">
            <h2 className="faq-intro__title">Veelgestelde Vragen</h2>
            <p className="faq-intro__text">
              Er worden veel vragen gesteld over de rijschool en rijlessen. Bekijk hier de antwoorden op de meest gestelde vragen. Staat jouw vraag hier niet tussen? Neem gerust contact met ons op!
            </p>
          </div>

          {/* Centered Minimalist FAQs (no heavy boxes) */}
          <div className="faq-clean-list">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`faq-clean-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-clean-question"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-chevron-icon">
                      <ChevronDown size={20} />
                    </span>
                  </button>

                  <div className={`faq-clean-collapse ${isOpen ? 'show' : ''}`}>
                    <div className="faq-clean-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered Contact box below FAQs */}
          <div className="faq-contact-card">
            <div className="faq-contact-card__icon">
              <MessageSquare size={24} />
            </div>
            <div className="faq-contact-card__info">
              <h4>Heb je een andere vraag?</h4>
              <p>Wij beantwoorden jouw vraag graag persoonlijk via contact of WhatsApp.</p>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => onNavigate('contact')}
            >
              Stel je vraag via Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
