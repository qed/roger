import { siteConfig } from '../../data/config';
import { guaranteeCopy } from '../../data/copy/shared';
import { renderLine } from '../../lib/claims';
import { offerAmounts } from '../../lib/offerPrice';
import { FadeUp } from '../FadeUp';
import { ToqueMark } from '../ToqueMark';

// Spec §6.8 (work) and §6A.8 (home). The accounts/password line renders only once
// signoff.passwordPolicy is true (spec §8.4.3). Amounts follow the displayed price (spec §3.1).
export function GuaranteeBand({ offer, id = 'guarantee' }: { offer: 'work' | 'home'; id?: string }) {
  const copy = guaranteeCopy[offer];
  const accounts = renderLine(guaranteeCopy.accounts);
  const body = copy.body(offerAmounts(offer, siteConfig));
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-copper-wash">
      <FadeUp className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <ToqueMark className="h-10 w-10 text-copper" />
        <h2 id={`${id}-heading`} className="mt-6 font-serif text-3xl leading-tight text-ink md:text-5xl">
          {guaranteeCopy.heading}
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {copy.working && (
            <p>
              <strong className="font-medium">{copy.workingLabel}</strong> {copy.working}
            </p>
          )}
          <p>
            <strong className="font-medium">{guaranteeCopy.claimLabel}</strong> {guaranteeCopy.claim}
          </p>
          {accounts && <p className="text-ink-soft">{accounts}</p>}
        </div>
      </FadeUp>
    </section>
  );
}
