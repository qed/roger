import { lazy, Suspense, useEffect } from 'react';
import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useCaptureWorkshopCode } from '../../hooks/useWorkshopCode';
import { captureUtmFromSearch } from '../../utils/utm';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollToHash } from './ScrollToHash';

// Preview-only launch banner (spec §8.4.6). The lazy() call sits inside the build-time branch: Vite
// replaces __VERCEL_ENV__ with a constant and Rollup drops the dead branch and its chunk from
// production builds. `npm run test:bundle` checks that production bundles contain none of it.
const showLaunchTools = __VERCEL_ENV__ !== 'production';
const PreviewBanner: LazyExoticComponent<ComponentType> | null = showLaunchTools
  ? lazy(() => import('../launch/PreviewBanner'))
  : null;

// Shared shell for every route: one sticky top wrapper (preview banner strip + header, so they stack
// as a single fixed strip), the page in <main>, then the footer. URL capture happens here, once:
// ?code= (stored, then stripped from the URL) and UTM params (remembered for the tab).
export function SiteLayout({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  useCaptureWorkshopCode();
  useEffect(() => {
    captureUtmFromSearch(search);
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream">
        Skip to content
      </a>
      <ScrollToHash />
      <div className="sticky top-0 z-40">
        {PreviewBanner && (
          <Suspense fallback={null}>
            <PreviewBanner />
          </Suspense>
        )}
        <Header />
      </div>
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
