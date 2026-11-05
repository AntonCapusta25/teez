import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CallbackModal } from './components/CallbackModal';
import { FloatingContact } from './components/FloatingContact';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PricesPage } from './pages/PricesPage';
import { CarPage } from './pages/CarPage';
import { FaqPage } from './pages/FaqPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);

  // Synchronize with URL hash on load and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validPages = ['home', 'over-teez', 'tarieven', 'de-lesauto', 'aanmelden', 'faq', 'contact', 'admin'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (page: string, packageChoice?: string) => {
    setCurrentPage(page);
    if (packageChoice) {
      setSelectedPackage(packageChoice);
    }
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentPage === 'admin';

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdmin && (
        <Header
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenCallback={() => setCallbackModalOpen(true)}
        />
      )}

      <main style={{ flexGrow: 1 }}>
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'over-teez' && <AboutPage onNavigate={navigateTo} />}
        {currentPage === 'tarieven' && <PricesPage onNavigate={navigateTo} />}
        {currentPage === 'de-lesauto' && <CarPage onNavigate={navigateTo} />}
        {currentPage === 'faq' && <FaqPage onNavigate={navigateTo} />}
        {currentPage === 'aanmelden' && (
          <RegisterPage
            initialPackage={selectedPackage}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'contact' && <ContactPage onNavigate={navigateTo} />}
        {currentPage === 'admin' && <AdminPage onNavigateHome={() => navigateTo('home')} />}
      </main>

      {!isAdmin && <Footer onNavigate={navigateTo} />}

      <CallbackModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
      />

      <FloatingContact />
    </div>
  );
}

export default App;
