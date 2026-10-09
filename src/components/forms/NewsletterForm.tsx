import { useCallback, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { siteConfig } from '../../data/config';
import { ctaLabels, newsletterCopy } from '../../data/copy/shared';
import { EMAIL_MAX_LENGTH, isValidEmail, mailtoHref } from '../../lib/formPost';
import type { FormErrors } from '../../lib/formPost';
import type { MenuKind } from '../../data/menu';
import { trackEvent } from '../../utils/analytics';
import { ctaClassName } from '../cta/ctaStyles';
import type { CtaTone } from '../cta/ctaStyles';
import { Honeypot } from './Honeypot';
import { useFormPost } from './useFormPost';

type NewsletterFormProps = {
  audience: MenuKind; // sent as the hidden `for` field
  tone?: CtaTone;
  className?: string;
};

type Values = { email: string; for: string };

const validate = (values: Values): FormErrors =>
  isValidEmail(values.email) && values.email.trim().length <= EMAIL_MAX_LENGTH ? {} : { email: newsletterCopy.invalidEmail };

// Spec §8.3: email only, plus hidden `for` (and UTM fields, added on submit). Empty endpoint → an
// "Email us" link to contactEmail (or, with no address either, a disabled "Opening soon" button); never a fake success. While posting, the button stays focusable
// (aria-disabled) and the status region says "Sending…"; a failed post moves focus to the error.
export function NewsletterForm({ audience, tone = 'light', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const onSuccess = useCallback(() => trackEvent('newsletter_submit', { for: audience }), [audience]);
  const { available, status, errors, submit, buttonState, liveText, statusRef, honeypotRef } = useFormPost<Values>({
    endpoint: siteConfig.forms.newsletterEndpoint,
    validate,
    submittingText: newsletterCopy.submitting,
    onSuccess
  });
  const id = useId();
  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  const statusId = `${id}-status`;
  const dark = tone === 'dark';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return; // the button is aria-disabled, not disabled; ignore a second activation
    void submit({ email, for: audience });
  };

  if (status === 'success') {
    return (
      <p role="status" className={`text-base ${dark ? 'text-cream' : 'text-ink'} ${className}`}>
        {newsletterCopy.success}
      </p>
    );
  }

  const mailto = available
    ? null
    : mailtoHref(siteConfig.contactEmail, newsletterCopy.emailFallback.subject, newsletterCopy.emailFallback.body);
  if (mailto) {
    return (
      <div className={className}>
        <a href={mailto} className={ctaClassName({ variant: 'primary', tone, size: 'md', live: true })}>
          {newsletterCopy.emailFallback.button}
        </a>
      </div>
    );
  }

  const fieldError = errors.email;

  return (
    <form noValidate onSubmit={onSubmit} className={`${dark ? 'surface-dark' : ''} ${className}`}>
      <input type="hidden" name="for" value={audience} />
      <Honeypot ref={honeypotRef} />
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
          maxLength={EMAIL_MAX_LENGTH}
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
          disabled={buttonState.disabled}
          aria-disabled={buttonState.ariaDisabled || undefined}
          className={ctaClassName({
            variant: 'primary',
            tone,
            size: 'md',
            live: available,
            className: `shrink-0 ${buttonState.ariaDisabled ? 'cursor-progress opacity-80' : ''}`
          })}>
          {buttonState.label === 'openingSoon'
            ? ctaLabels.openingSoon
            : buttonState.label === 'submitting'
              ? newsletterCopy.submitting
              : newsletterCopy.submit}
        </button>
      </div>
      {fieldError && (
        <p id={errorId} className={`mt-2 text-sm ${dark ? 'text-copper-light' : 'text-copper'}`}>
          {fieldError}
        </p>
      )}
      <p
        ref={statusRef}
        id={statusId}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={`text-sm outline-none ${dark ? 'text-cream' : 'text-ink'} ${liveText ? 'mt-2' : ''}`}>
        {liveText}
      </p>
    </form>
  );
}
