import { useCallback, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { siteConfig } from '../../data/config';
import { ctaLabels, newsletterCopy } from '../../data/copy/shared';
import { isValidEmail } from '../../lib/formPost';
import type { FormErrors } from '../../lib/formPost';
import type { MenuKind } from '../../data/menu';
import { trackEvent } from '../../utils/analytics';
import { ctaClassName } from '../cta/ctaStyles';
import type { CtaTone } from '../cta/ctaStyles';
import { useFormPost } from './useFormPost';

type NewsletterFormProps = {
  audience: MenuKind; // sent as the hidden `for` field
  tone?: CtaTone;
  className?: string;
};

type Values = { email: string; for: string };

const validate = (values: Values): FormErrors =>
  isValidEmail(values.email) ? {} : { email: newsletterCopy.invalidEmail };

// Spec §8.3: email only, plus hidden `for` (and UTM fields, added on submit). Empty endpoint →
// a disabled "Opening soon" button; never a fake success.
export function NewsletterForm({ audience, tone = 'light', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const onSuccess = useCallback(() => trackEvent('newsletter_submit', { for: audience }), [audience]);
  const { available, status, errors, submit, errorMessage } = useFormPost<Values>({
    endpoint: siteConfig.forms.newsletterEndpoint,
    validate,
    onSuccess
  });
  const id = useId();
  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  const statusId = `${id}-status`;
  const dark = tone === 'dark';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit({ email, for: audience });
  };

  if (status === 'success') {
    return (
      <p role="status" className={`text-base ${dark ? 'text-cream' : 'text-ink'} ${className}`}>
        {newsletterCopy.success}
      </p>
    );
  }

  const fieldError = errors.email;
  const submitting = status === 'submitting';

  return (
    <form noValidate onSubmit={onSubmit} className={`${dark ? 'surface-dark' : ''} ${className}`} aria-describedby={errorMessage ? statusId : undefined}>
      <input type="hidden" name="for" value={audience} />
      <label htmlFor={emailId} className={`block text-sm font-medium ${dark ? 'text-cream' : 'text-ink'}`}>
        {newsletterCopy.emailLabel}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={newsletterCopy.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={!available}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? errorId : undefined}
          className={`min-h-[44px] w-full flex-1 rounded-full border px-4 text-base text-ink placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-70 ${
            fieldError ? 'border-copper' : 'border-rule'
          } bg-paper`}
        />
        <button
          type="submit"
          disabled={!available || submitting}
          className={ctaClassName({
            variant: 'primary',
            tone,
            size: 'md',
            live: available,
            className: `shrink-0 ${submitting ? 'opacity-80' : ''}`
          })}>
          {!available ? ctaLabels.openingSoon : submitting ? newsletterCopy.submitting : newsletterCopy.submit}
        </button>
      </div>
      {fieldError && (
        <p id={errorId} className={`mt-2 text-sm ${dark ? 'text-copper-light' : 'text-copper'}`}>
          {fieldError}
        </p>
      )}
      <p id={statusId} role="status" aria-live="polite" className={`text-sm ${dark ? 'text-cream' : 'text-ink'} ${errorMessage ? 'mt-2' : ''}`}>
        {errorMessage}
      </p>
    </form>
  );
}
