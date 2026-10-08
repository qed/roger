import { siteConfig } from '../../data/config';
import { adminAnchorCopy, diyColumns, diyCopy } from '../../data/copy/pricing';
import type { OfferId } from '../../data/offers';
import { displayedOffer } from '../../lib/offerPrice';
import { adminAnnualCost, formatCad } from '../../lib/proofLines';

// "Do it yourself vs. Roger" (spec §6.7). For work, the admin anchor follows, only when a sourced
// hourly rate is configured (spec §8.1).
export function DiyTable({ offer }: { offer: OfferId }) {
  const { caption, rows } = diyCopy[offer];
  const annual = offer === 'work' ? adminAnnualCost(siteConfig.anchor.adminHourly) : null;
  const source = siteConfig.anchor.source.trim();
  const price = formatCad(displayedOffer(offer, siteConfig).price);
  return (
    <div>
      <table className="w-full border-collapse text-left text-sm md:text-base">
        <caption className="mb-4 text-left font-serif text-2xl text-ink md:text-3xl">{caption}</caption>
        <thead>
          <tr className="border-b border-ink/30">
            <td className="w-1/3 py-3 pr-3" />
            <th scope="col" className="py-3 pr-3 font-medium text-ink-soft">
              {diyColumns.diy}
            </th>
            <th scope="col" className="py-3 font-medium text-ink">
              {siteConfig.productName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-rule align-top">
              <th scope="row" className="py-3 pr-3 font-medium text-ink">
                {row.label}
              </th>
              <td className="py-3 pr-3 text-ink-soft">{row.diy}</td>
              <td className="py-3 text-ink">{typeof row.roger === 'function' ? row.roger(price) : row.roger}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {annual !== null && (
        <div className="mt-6 text-base text-ink">
          <p>
            {adminAnchorCopy.text
              .replace('{hourly}', formatCad(siteConfig.anchor.adminHourly))
              .replace('{annual}', formatCad(annual))
              .replace('{price}', price)}
          </p>
          {source && (
            <p className="mt-1 text-sm text-ink-soft">
              {adminAnchorCopy.sourcePrefix}
              {source}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
