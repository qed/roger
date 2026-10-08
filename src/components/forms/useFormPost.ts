import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteConfig } from '../../data/config';
import { buildPostBody, canSubmit, createSubmitter, liveStatusText, postJson, submitButtonState, submitErrorMessage } from '../../lib/formPost';
import type { FormErrors, FormStatus, LooseValues, SubmitterOptions } from '../../lib/formPost';
import { getUtmParams } from '../../utils/utm';

export type { FormStatus } from '../../lib/formPost';

type Options<V extends LooseValues> = {
  endpoint: string;
  validate: (values: V) => FormErrors; // field name → message; empty object means valid
  onSuccess?: (values: V) => void;
  shape?: (values: V) => LooseValues; // form values → posted fields (before UTM); identity by default
  submittingText: string; // announced in the polite live region while the post is in flight
};

// Shared form submit (spec §8.1, §8.3; R12b). Validates, POSTs JSON with the UTM fields, and reports
// idle → submitting → success | error. An empty endpoint means no submit is possible (the form shows
// "Opening soon"). Success is never faked, and the caller's values are left untouched on error.
// The guard (one post at a time, nothing after success, retry after failure, no state updates after
// unmount, the honeypot) is createSubmitter in src/lib/formPost.ts, which is tested.
//
// Focus and announcements, shared by every form: the submit button stays focusable while posting
// (buttonState: aria-disabled, never `disabled`, except for "Opening soon"); the status region (statusRef,
// tabIndex -1) says "Sending…" while posting and the error after a failed post, and takes focus on the
// failure. The honeypot input (honeypotRef) is read on submit.
export function useFormPost<V extends LooseValues>({ endpoint, validate, onSuccess, shape, submittingText }: Options<V>) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const available = canSubmit(endpoint);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Latest props, read by the submitter on each call, so a re-render never resubmits or goes stale.
  const latest = useRef({ endpoint, validate, onSuccess, shape });
  useLayoutEffect(() => {
    latest.current = { endpoint, validate, onSuccess, shape };
  });

  const [submitter] = useState(() =>
    createSubmitter<V>(
      (): SubmitterOptions<V> => ({
        validate: (values) => latest.current.validate(values),
        post: (values) =>
          postJson(
            (url, init) => fetch(url, init),
            latest.current.endpoint,
            buildPostBody(values, getUtmParams(), latest.current.shape)
          ),
        onErrors: setErrors,
        onStatus: setStatus,
        onSuccess: (values) => latest.current.onSuccess?.(values)
      })
    )
  );

  useEffect(() => {
    submitter.setActive(true);
    return () => submitter.setActive(false);
  }, [submitter]);

  // A failed post: move focus to the error, so it's read and the visitor is next to the retry.
  useEffect(() => {
    if (status === 'error') statusRef.current?.focus();
  }, [status]);

  // Resolves true on a real success (or a silently trapped bot). A submit while one is in flight is ignored.
  const submit = useCallback(
    async (values: V): Promise<boolean> => {
      if (!canSubmit(latest.current.endpoint)) return false;
      const outcome = await submitter.submit(values, honeypotRef.current?.value ?? '');
      return outcome === 'ok' || outcome === 'trapped';
    },
    [submitter]
  );

  const errorMessage = status === 'error' ? submitErrorMessage(siteConfig.contactEmail) : null;

  return {
    available,
    status,
    errors,
    submit,
    errorMessage,
    buttonState: submitButtonState(available, status),
    liveText: liveStatusText(status, submittingText, errorMessage ?? ''),
    statusRef,
    honeypotRef
  };
}
