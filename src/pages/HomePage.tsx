import { StickyCtaBar } from '../components/cta/StickyCtaBar';
import { JsonLd } from '../components/layout/JsonLd';
import { usePageMeta } from '../components/layout/usePageMeta';
import { BeforeAfter } from '../components/sections/BeforeAfter';
import { FaqList } from '../components/sections/FaqList';
import { FinalCta } from '../components/sections/FinalCta';
import { GuaranteeBand } from '../components/sections/GuaranteeBand';
import { HomeHero } from '../components/sections/HomeHero';
import { HomeMealPlan } from '../components/sections/HomeMealPlan';
import { PricingSection } from '../components/sections/PricingSection';
import { ProofSection } from '../components/sections/ProofSection';
import { Timeline } from '../components/sections/Timeline';
import { WhatYouGet } from '../components/sections/WhatYouGet';
import { siteConfig } from '../data/config';
import { HOME_JOBS_ID, homeBeforeAfterCopy, homeMeta, homeTimelineCopy } from '../data/copy/home';
import { homeFaqs } from '../data/homeFaqs';
import { resolveTimelineSteps } from '../lib/claims';
import { offerAmounts } from '../lib/offerPrice';

// `/home` (spec §6A): one dream for busy parents, the home setup at the displayed home price. Exactly
// these sections in this order; the numbers in the comments are the spec's §6A items.
export function HomePage() {
  usePageMeta({ title: homeMeta.title, description: homeMeta.description(offerAmounts('home', siteConfig).price) });

  return (
    <>
      <JsonLd />
      {/* 1 */}
      <HomeHero />
      {/* 2 */}
      <BeforeAfter
        id="example-sunday"
        label={homeBeforeAfterCopy.label}
        heading={homeBeforeAfterCopy.heading}
        rows={homeBeforeAfterCopy.rows}
        closing={homeBeforeAfterCopy.closing}
      />
      {/* 3: home case studies (hidden until there are any) + Peter's own setup */}
      <ProofSection for="home" />
      {/* 4: pick 5 of 12; the hero's "See the 12 jobs" link scrolls here */}
      <WhatYouGet offer="home" id={HOME_JOBS_ID} />
      {/* 5 */}
      <HomeMealPlan />
      {/* 6 */}
      <Timeline id="how" heading={homeTimelineCopy.heading} steps={resolveTimelineSteps(homeTimelineCopy.steps)} note={homeTimelineCopy.note} />
      {/* 7 */}
      <PricingSection offer="home" />
      {/* 8 */}
      <GuaranteeBand offer="home" />
      {/* 9 */}
      <FaqList id="faq" items={homeFaqs} offer="home" />
      {/* 10: carries FINAL_CTA_ID, which the sticky bar watches */}
      <FinalCta offer="home" />
      {/* 11 */}
      <StickyCtaBar ctas={['home']} />
    </>
  );
}
