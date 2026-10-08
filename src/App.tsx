import { lazy, Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { LibraryPage } from './pages/LibraryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThanksHomePage } from './pages/ThanksHomePage';
import { ThanksWorkPage } from './pages/ThanksWorkPage';
import { WorkPage } from './pages/WorkPage';
import { WorkshopsPage } from './pages/WorkshopsPage';

// Preview-only /launch page (spec §8.4.6). The lazy() call sits inside the build-time branch so Rollup
// drops the chunk from production builds, and the route is never registered there. The preview banner
// follows the same pattern in SiteLayout. `npm run test:bundle` checks both stay out of production.
const showLaunchTools = __VERCEL_ENV__ !== 'production';
const LaunchPage: LazyExoticComponent<ComponentType> | null = showLaunchTools
  ? lazy(() => import('./pages/LaunchPage'))
  : null;

// Route table (spec §5). Pages are placeholders until their units land.
export function App() {
  return (
    <SiteLayout>
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
    </SiteLayout>
  );
}
