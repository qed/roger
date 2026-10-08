import { lazy, Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { WorkPage } from './pages/WorkPage';

// Every page except the main one loads on demand, so / ships only its own code (spec §10 performance).
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ThanksHomePage = lazy(() => import('./pages/ThanksHomePage').then((m) => ({ default: m.ThanksHomePage })));
const ThanksWorkPage = lazy(() => import('./pages/ThanksWorkPage').then((m) => ({ default: m.ThanksWorkPage })));
const WorkshopsPage = lazy(() => import('./pages/WorkshopsPage').then((m) => ({ default: m.WorkshopsPage })));

// Preview-only /launch page (spec §8.4.6). The lazy() call sits inside the build-time branch so Rollup
// drops the chunk from production builds, and the route is never registered there. The preview banner
// follows the same pattern in SiteLayout. `npm run test:bundle` checks both stay out of production.
const showLaunchTools = __VERCEL_ENV__ !== 'production';
const LaunchPage: LazyExoticComponent<ComponentType> | null = showLaunchTools
  ? lazy(() => import('./pages/LaunchPage'))
  : null;

// Route table (spec §5).
export function App() {
  return (
    <SiteLayout>
      {/* Holds the page's space while its code loads, so the footer doesn't jump up and back (layout shift). */}
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
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
      </Suspense>
    </SiteLayout>
  );
}
