import { useState } from 'react';
import type { FormEvent } from 'react';
import { siteConfig } from '../data/config';
import { getUtmParams } from '../utils/utm';
import { trackEvent } from '../utils/analytics';
import type { Audience, WaitlistStatus } from '../types/waitlist';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useWaitlist(audience: Audience) {
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [status, setStatus] = useState<WaitlistStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    // No endpoint means signups aren't stored anywhere: say so instead of faking success.
    if (!siteConfig.waitlistEndpoint) {
      setError("Signups aren't open yet, so your email wasn't saved. Please check back soon.");
      setStatus('error');
      return;
    }
    setError(null);
    setStatus('submitting');

    const payload = {
      email: email.trim(),
      audience,
      postalCode: postalCode.trim() || undefined,
      ...getUtmParams()
    };

    try {
      const res = await fetch(siteConfig.waitlistEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      trackEvent('waitlist_signup', { audience });
      setStatus('success');
    } catch {
      setError('Something went wrong on our side. Please try again.');
      setStatus('error');
    }
  }

  function updateEmail(value: string) {
    setEmail(value);
    if (status === 'error') {
      setStatus('idle');
      setError(null);
    }
  }

  return { email, setEmail: updateEmail, postalCode, setPostalCode, status, error, submit };
}