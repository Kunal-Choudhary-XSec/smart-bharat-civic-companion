import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/sections/Hero';
import { QuickActions } from './components/sections/QuickActions';
import { PopularServices } from './components/sections/PopularServices';
import { HowItWorks } from './components/sections/HowItWorks';
import { Accessibility } from './components/sections/Accessibility';
import { ServicesPage } from './components/pages/ServicesPage';
import { SchemesPage } from './components/pages/SchemesPage';
import { ReportPage } from './components/pages/ReportPage';
import { TrackPage } from './components/pages/TrackPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AssistantPage } from './components/pages/AssistantPage';
import { ComingSoon } from './components/ui/ComingSoon';
import type { PageId } from './data/mockData';
import type { Scheme } from './data/schemeData';

interface ComingSoonState {
  title: string;
  description: string;
}

export default function App() {
  const [page, setPage] = useState<PageId>('home');
  const [comingSoon, setComingSoon] = useState<ComingSoonState | null>(null);
  const [aiSeedQuestion, setAiSeedQuestion] = useState<string | null>(null);

  const navigate = (next: PageId) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showComingSoon = (title: string, description: string) => {
    setComingSoon({ title, description });
  };

  // Called from the Scheme Finder when a user clicks "Ask Bharat AI".
  // Navigates to the existing AI Assistant and seeds a contextual question.
  const askAiAboutScheme = (scheme: Scheme) => {
    const question = `Explain why ${scheme.name} may be relevant to my profile, what documents may be required, and what eligibility information I should verify.`;
    setAiSeedQuestion(question);
    navigate('assistant');
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar active={page} onNavigate={navigate} />

      <main className="flex-1">
        {page === 'home' && (
          <>
            <Hero onNavigate={navigate} />
            <QuickActions onNavigate={navigate} />
            <PopularServices onNavigate={navigate} />
            <HowItWorks />
            <Accessibility />
          </>
        )}
        {page === 'services' && (
          <ServicesPage onNavigate={navigate} onComingSoon={showComingSoon} />
        )}
        {page === 'schemes' && (
          <SchemesPage onAskAi={askAiAboutScheme} />
        )}
        {page === 'report' && <ReportPage />}
        {page === 'track' && <TrackPage />}
        {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {page === 'assistant' && (
          <AssistantPage seedQuestion={aiSeedQuestion} onSeedConsumed={() => setAiSeedQuestion(null)} />
        )}
      </main>

      <Footer />

      {comingSoon && (
        <ComingSoon
          title={comingSoon.title}
          description={comingSoon.description}
          onClose={() => setComingSoon(null)}
        />
      )}
    </div>
  );
}
