import React from 'react';

interface HeadPageProps {
  title: string;
  onNavigateHome: () => void;
}

export const HeadPage: React.FC<HeadPageProps> = ({ title, onNavigateHome }) => {
  return (
    <div className="head-page">
      <div className="container">
        <div className="head-page__inner">
          <h1 className="title-page">{title}</h1>
          <div className="breadcrumbs">
            <ul className="breadcrumbs__list">
              <li className="breadcrumbs__item">
                <button
                  type="button"
                  className="breadcrumbs__link"
                  onClick={onNavigateHome}
                >
                  Index
                </button>
              </li>
              <li className="breadcrumbs__item breadcrumbs__item_current">
                {title}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
