import React, { useEffect } from 'react';
import { siteConfig } from '../data/config';
import type { TaglineKey } from '../data/config';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ProblemSection } from '../components/ProblemSection';
import { HowItWorks } from '../components/HowItWorks';
import { HomeSection } from '../components/HomeSection';
import { TimeMathBand } from '../components/TimeMathBand';
import { WorkSection } from '../components/WorkSection';
import { StandardBand } from '../components/StandardBand';
import { StorySection } from '../components/StorySection';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

type LandingProps = {
  headline: TaglineKey;
};

export function Landing({ headline }: LandingProps) {
  useEffect(() => {
    document.title = siteConfig.seo.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = siteConfig.seo.description;
  }, []);

  return (
    <div className="min-h-screen w-full bg-cream font-sans text-ink">
      <Header />
      <main>
        <Hero headline={headline} />
        <ProblemSection />
        <HowItWorks />
        <HomeSection />
        <TimeMathBand />
        <WorkSection />
        <StandardBand />
        <StorySection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}