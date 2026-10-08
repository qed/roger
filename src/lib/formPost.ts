// Form submission rules (spec §8.1, §8.3; R12b). Framework-free and tested; useFormPost wraps it.
// An empty endpoint means the form can't submit at all. Success is only ever a real 2xx response.
import { formCopy } from '../data/copy/shared';

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;
// Values as a form may hold them (a missing key reads as empty). UTM params have the same shape.
export type LooseValues = Record<string, string | undefined>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// RFC 5321's practical limit on an address; the email inputs carry it as maxLength.
export const EMAIL_MAX_LENGTH = 254;

// How long a post may take before the form gives up and shows the error (with the retry).
export const POST_TIMEOUT_MS = 15_000;

// The spam trap (Formspree's convention): a visually hidden, aria-hidden, untabbable field people never
// see or fill. Anything typed into it means a bot; the form then shows its normal success and posts nothing.
export const HONEYPOT_FIELD = '_gotcha';

export function honeypotTripped(value: string | null | undefined): boolean {
  return (value ?? '').trim() !== '';
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

export function canSubmit(endpoint: string): boolean {
  return endpoint.trim().length > 0;
}

// R12b: the email clause is dropped when no contact email is configured.
export function submitErrorMessage(contactEmail: string): string {
  return formCopy.submitError(contactEmail.trim());
}

// Trims values and adds attribution fields. Empty values are omitted; UTM never overwrites a field.
export function buildPayload(values: LooseValues, utm: LooseValues = {}): FormValues {
  const payload: FormValues = {};
  for (const [key, value] of Object.entries(utm)) {
    if (value) payload[key] = value;
  }
  for (const [key, value] of Object.entries(values)) {
    const trimmed = (value ?? '').trim();
    if (trimmed) payload[key] = trimmed;
  }
  return payload;
}

// What a form POSTs: its values, through its optional shape (form fields → posted fields), plus the
// UTM params, with empty values omitted. useFormPost posts exactly this.
export function buildPostBody<V extends LooseValues>(values: V, utm: LooseValues = {}, shape?: (values: V) => LooseValues): FormValues {
  return buildPayload(shape ? shape(values) : values, utm);
}

type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }
) => Promise<{ ok: boolean }>;

// Resolves true only on a 2xx response; network errors, empty endpoints and a post that takes longer
// than timeoutMs resolve false (the request is aborted, so a hung endpoint never leaves the form stuck).
export async function postJson(fetchFn: FetchLike, endpoint: string, payload: FormValues, timeoutMs = POST_TIMEOUT_MS): Promise<boolean> {
  if (!canSubmit(endpoint)) return false;
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timedOut = new Promise<false>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve(false);
    }, timeoutMs);
  });
  try {
    const request = fetchFn(endpoint.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).then(
      (res) => res.ok,
      () => false
    );
    return await Promise.race([request, timedOut]);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export type SubmitOutcome = 'invalid' | 'busy' | 'done' | 'ok' | 'failed' | 'trapped';

// The submit button: really disabled only when the form can't submit at all ("Opening soon"). While a
// post is in flight it stays focusable (aria-disabled; a second activation is ignored by the submitter),
// so keyboard and screen-reader users keep their place.
export type SubmitButtonState = { disabled: boolean; ariaDisabled: boolean; label: 'openingSoon' | 'submitting' | 'submit' };

export function submitButtonState(available: boolean, status: FormStatus): SubmitButtonState {
  if (!available) return { disabled: true, ariaDisabled: false, label: 'openingSoon' };
  const submitting = status === 'submitting';
  return { disabled: false, ariaDisabled: submitting, label: submitting ? 'submitting' : 'submit' };
}

// What the polite live region says: "Sending…" while posting, the error after a failed post, else nothing.
export function liveStatusText(status: FormStatus, submittingText: string, errorMessage: string): string {
  if (status === 'submitting') return submittingText;
  if (status === 'error') return errorMessage;
  return '';
}

export type SubmitterOptions<V> = {
  validate: (values: V) => FormErrors; // field name → message; empty object means valid
  post: (values: V) => Promise<boolean>; // may also reject; treated as a failure
  onErrors: (errors: FormErrors) => void;
  onStatus: (status: FormStatus) => void;
  onSuccess?: (values: V) => void;
};

export type Submitter<V> = {
  // honeypot: the spam-trap field's value. Filled → no post, no onSuccess, but the normal success status.
  submit(values: V, honeypot?: string): Promise<SubmitOutcome>;
  setActive(active: boolean): void; // false after unmount: no further status or success callbacks
};

// The submit guard behind useFormPost. Invalid input never posts; a second submit while one is in
// flight, or any submit after a success, is ignored; a failed or rejected post clears the guard so the
// visitor can retry. A tripped honeypot (after validation, so it looks like any other submit) shows
// success without posting or calling onSuccess, and ends the form like a real success. Options are read on every call, so callers can pass getters over their latest refs.
export function createSubmitter<V>(options: () => SubmitterOptions<V>): Submitter<V> {
  let inFlight = false;
  let succeeded = false;
  let active = true;

  return {
    setActive(value) {
      active = value;
    },
    async submit(values, honeypot) {
      if (succeeded) return 'done';
      if (inFlight) return 'busy';
      const opts = options();
      const errors = opts.validate(values);
      opts.onErrors(errors);
      if (Object.keys(errors).length) {
        opts.onStatus('idle');
        return 'invalid';
      }
      if (honeypotTripped(honeypot)) {
        succeeded = true;
        opts.onStatus('success');
        return 'trapped';
      }
      inFlight = true;
      opts.onStatus('submitting');
      let ok = false;
      try {
        ok = await opts.post(values);
      } catch {
        ok = false;
      } finally {
        inFlight = false;
      }
      if (ok) succeeded = true;
      if (!active) return ok ? 'ok' : 'failed';
      const latest = options();
      latest.onStatus(ok ? 'success' : 'error');
      if (ok) latest.onSuccess?.(values);
      return ok ? 'ok' : 'failed';
    }
  };
}
