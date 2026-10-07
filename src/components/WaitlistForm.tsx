import React, { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { siteConfig } from '../data/config';
import { useAudience } from '../contexts/AudienceContext';
import { useWaitlist } from '../hooks/useWaitlist';
import { getUtmParams } from '../utils/utm';
import type { Audience } from '../types/waitlist';

type WaitlistFormProps = {
  tone?: 'light' | 'dark';
  showAudienceChoice?: boolean;
  showPostalCode?: boolean;
  audienceOverride?: Audience;
  className?: string;
};

const audienceOptions: {value: Audience;label: string;}[] = [
{ value: 'home', label: 'Home' },
{ value: 'work', label: 'Work' },
{ value: 'both', label: 'Both' }];


export function WaitlistForm({
  tone = 'light',
  showAudienceChoice = false,
  showPostalCode = false,
  audienceOverride,
  className = ''
}: WaitlistFormProps) {
  const { audience: sharedAudience, setAudience } = useAudience();
  const audience = audienceOverride ?? sharedAudience;
  const { email, setEmail, postalCode, setPostalCode, status, error, submit } = useWaitlist(audience);
  const uid = useId();
  const dark = tone === 'dark';
  const utm = getUtmParams();

  if (status === 'success') {
    return (
      <motion.p
        role="status"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className={`flex items-center gap-3 text-base ${dark ? 'text-cream' : 'text-ink'} ${className}`}>
        
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          dark ? 'bg-copper-light text-ink' : 'bg-copper text-cream'}`
          }>
          
          <CheckIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        {siteConfig.cta.success}
      </motion.p>);

  }

  const inputClass = dark ?
  'bg-white/5 border-white/25 text-cream placeholder:text-cream/55 focus:border-copper-light' :
  'bg-paper border-rule text-ink placeholder:text-ink-faint focus:border-ink';

  return (
    <form onSubmit={submit} noValidate className={className} aria-label="Join the waitlist">
      <input type="hidden" name="audience" value={audience} />
      {Object.entries(utm).map(([key, value]) =>
      <input key={key} type="hidden" name={key} value={value} />
      )}

      {showAudienceChoice &&
      <fieldset className="mb-4">
          <legend className={`mb-2 text-sm ${dark ? 'text-cream/80' : 'text-ink-soft'}`}>For</legend>
          <div className={`inline-flex rounded-md border p-1 ${dark ? 'border-white/20' : 'border-rule bg-paper'}`}>
            {audienceOptions.map((opt) => {
            const checked = sharedAudience === opt.value;
            return (
              <label
                key={opt.value}
                className={`relative cursor-pointer rounded px-4 py-1.5 text-sm transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper ${
                checked ?
                dark ?
                'bg-cream text-ink' :
                'bg-ink text-cream' :
                dark ?
                'text-cream/80 hover:text-cream' :
                'text-ink-soft hover:text-ink'}`
                }>
                
                  <input
                  type="radio"
                  name={`${uid}-audience`}
                  value={opt.value}
                  checked={checked}
                  onChange={() => setAudience(opt.value)}
                  className="sr-only" />
                
                  {opt.label}
                </label>);

          })}
          </div>
        </fieldset>
      }

      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${uid}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === 'error' && !!error}
          aria-describedby={error ? `${uid}-error` : undefined}
          className={`h-12 w-full min-w-0 flex-1 rounded-md border px-4 text-base outline-none transition-colors duration-150 ${inputClass}`} />
        
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 text-sm font-medium transition-[background-color,transform] duration-150 active:scale-[0.98] disabled:opacity-70 ${
          dark ? 'bg-cream text-ink hover:bg-white' : 'bg-ink text-cream hover:bg-ink/90'}`
          }>
          
          {status === 'submitting' ?
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> :
          null}
          {siteConfig.cta.primary}
          {status !== 'submitting' && <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {showPostalCode &&
      <div className="mt-2 sm:max-w-[14rem]">
          <label htmlFor={`${uid}-postal`} className="sr-only">
            Postal code (optional)
          </label>
          <input
          id={`${uid}-postal`}
          type="text"
          name="postalCode"
          autoComplete="postal-code"
          placeholder="Postal code (optional)"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
          maxLength={7}
          className={`h-11 w-full rounded-md border px-4 text-sm outline-none transition-colors duration-150 ${inputClass}`} />
        
        </div>
      }

      <AnimatePresence>
        {error &&
        <motion.p
          id={`${uid}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`mt-2 text-sm ${dark ? 'text-copper-light' : 'text-copper'}`}>
          
            {error}
          </motion.p>
        }
      </AnimatePresence>
    </form>);

}