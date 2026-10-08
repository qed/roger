import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { LibraryPage } from './pages/LibraryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThanksHomePage } from './pages/ThanksHomePage';
import { ThanksWorkPage } from './pages/ThanksWorkPage';
import { WorkPage } from './pages/WorkPage';
import { WorkshopsPage } from './pages/WorkshopsPage';

// Route table (spec §5). Pages are placeholders until their units land.
export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Header />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<WorkPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/thanks/work" element={<ThanksWorkPage />} />
          <Route path="/thanks/home" element={<ThanksHomePage />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/refunds" element={<LegalPage kind="refunds" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
