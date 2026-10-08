import { StickyCtaBar } from '../components/cta/StickyCtaBar';
import { JsonLd } from '../components/layout/JsonLd';
import { usePageMeta } from '../components/layout/usePageMeta';
import { AboutPeter } from '../components/sections/AboutPeter';
import { BeforeAfter } from '../components/sections/BeforeAfter';
import { FaqList } from '../components/sections/FaqList';
import { FinalCta } from '../components/sections/FinalCta';
import { GuaranteeBand } from '../components/sections/GuaranteeBand';
import { PricingSection } from '../components/sections/PricingSection';
import { ProofSection } from '../components/sections/ProofSection';
import { Timeline } from '../components/sections/Timeline';
import { WhatYouGet } from '../components/sections/WhatYouGet';
import { WorkHero } from '../components/sections/WorkHero';
import { siteConfig } from '../data/config';
import { workBeforeAfterCopy, workMeta, workTimelineCopy } from '../data/copy/work';
import { faqs } from '../data/faqs';
import { offerAmounts } from '../lib/offerPrice';

// `/` sells one product, the work setup (spec §6): the hero, then exactly these sections in this order.
// Nothing else goes on this page; home appears only as the header link and the line under pricing (§12).
export function WorkPage() {
  usePageMeta({ title: workMeta.title, description: workMeta.description(offerAmounts('work', siteConfig).price) });

  return (
    <>
      <JsonLd />
      {/* §6.2 */}
      <WorkHero />
      {/* §6.3 */}
      <BeforeAfter
        id="example-monday"
        label={workBeforeAfterCopy.label}
        heading={workBeforeAfterCopy.heading}
        rows={workBeforeAfterCopy.rows}
        closing={workBeforeAfterCopy.closing}
      />
      {/* §6.4 */}
      <ProofSection for="work" />
      {/* §6.5 */}
      <WhatYouGet offer="work" />
      {/* §6.6 */}
      <Timeline id="how" heading={workTimelineCopy.heading} steps={workTimelineCopy.steps} note={workTimelineCopy.note} />
      {/* §6.7 */}
      <PricingSection offer="work" />
      {/* §6.8 */}
      <GuaranteeBand offer="work" />
      {/* §6.9 */}
      <AboutPeter />
      {/* §6.10 */}
      <FaqList id="faq" items={faqs} offer="work" />
      {/* §6.11: carries FINAL_CTA_ID, which the sticky bar watches */}
      <FinalCta offer="work" />
      {/* §9.6 */}
      <StickyCtaBar ctas={['fitcall', 'deposit']} />
    </>
  );
}
