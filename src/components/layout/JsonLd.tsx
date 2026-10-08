import { siteConfig } from '../../data/config';
import { buildJsonLd, serializeJsonLd } from '../../lib/jsonLd';

// Structured data for / and /home (spec §10): a ProfessionalService with both offers. See src/lib/jsonLd.ts.
export function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd(siteConfig)) }} />
  );
}
