import { lazy, Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
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

// Preview-only launch tooling (spec §8.4.6). The lazy() calls themselves sit inside the branch: Vite
// replaces __VERCEL_ENV__ with a constant, and Rollup then drops the dead branch and both chunks from
// production builds. Calling lazy() outside the condition would keep the chunks in the bundle.
// `npm run test:bundle` checks that production bundles contain none of it.
const showLaunchTools = __VERCEL_ENV__ !== 'production';
const PreviewBanner: LazyExoticComponent<ComponentType> | null = showLaunchTools
  ? lazy(() => import('./components/launch/PreviewBanner'))
  : null;
const LaunchPage: LazyExoticComponent<ComponentType> | null = showLaunchTools
  ? lazy(() => import('./pages/LaunchPage'))
  : null;

// Route table (spec §5). Pages are placeholders until their units land.
export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      {PreviewBanner && (
        <Suspense fallback={null}>
          <PreviewBanner />
        </Suspense>
      )}
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
          {LaunchPage && (
            <Route
              path="/launch"
              element={
                <Suspense fallback={null}>
                  <LaunchPage />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
