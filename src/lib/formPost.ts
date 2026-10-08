// Form submission rules (spec §8.1, §8.3; R12b). Framework-free and tested; useFormPost wraps it.
// An empty endpoint means the form can't submit at all. Success is only ever a real 2xx response.
import { formCopy } from '../data/copy/shared';

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
export function buildPayload(values: FormValues, utm: Record<string, string | undefined> = {}): FormValues {
  const payload: FormValues = {};
  for (const [key, value] of Object.entries(utm)) {
    if (value) payload[key] = value;
  }
  for (const [key, value] of Object.entries(values)) {
    const trimmed = value.trim();
    if (trimmed) payload[key] = trimmed;
  }
  return payload;
}

type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string }
) => Promise<{ ok: boolean }>;

// Resolves true only on a 2xx response; network errors and empty endpoints resolve false.
export async function postJson(fetchFn: FetchLike, endpoint: string, payload: FormValues): Promise<boolean> {
  if (!canSubmit(endpoint)) return false;
  try {
    const res = await fetchFn(endpoint.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export type SubmitOutcome = 'invalid' | 'busy' | 'done' | 'ok' | 'failed';

export type SubmitterOptions<V> = {
  validate: (values: V) => FormErrors; // field name → message; empty object means valid
  post: (values: V) => Promise<boolean>; // may also reject; treated as a failure
  onErrors: (errors: FormErrors) => void;
  onStatus: (status: FormStatus) => void;
  onSuccess?: (values: V) => void;
};

export type Submitter<V> = {
  submit(values: V): Promise<SubmitOutcome>;
  setActive(active: boolean): void; // false after unmount: no further status or success callbacks
};

// The submit guard behind useFormPost. Invalid input never posts; a second submit while one is in
// flight, or any submit after a success, is ignored; a failed or rejected post clears the guard so the
// visitor can retry. Options are read on every call, so callers can pass getters over their latest refs.
export function createSubmitter<V>(options: () => SubmitterOptions<V>): Submitter<V> {
  let inFlight = false;
  let succeeded = false;
  let active = true;

  return {
    setActive(value) {
      active = value;
    },
    async submit(values) {
      if (succeeded) return 'done';
      if (inFlight) return 'busy';
      const opts = options();
      const errors = opts.validate(values);
      opts.onErrors(errors);
      if (Object.keys(errors).length) {
        opts.onStatus('idle');
        return 'invalid';
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
