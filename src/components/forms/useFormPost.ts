import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteConfig } from '../../data/config';
import { buildPayload, canSubmit, createSubmitter, postJson, submitErrorMessage } from '../../lib/formPost';
import type { FormErrors, FormStatus, FormValues, SubmitterOptions } from '../../lib/formPost';
import { getUtmParams } from '../../utils/utm';

export type { FormStatus } from '../../lib/formPost';

type Options<V extends FormValues> = {
  endpoint: string;
  validate: (values: V) => FormErrors; // field name → message; empty object means valid
  onSuccess?: (values: V) => void;
};

// Shared form submit (spec §8.1, §8.3; R12b). Validates, POSTs JSON with the UTM fields, and reports
// idle → submitting → success | error. An empty endpoint means no submit is possible (the form shows
// "Opening soon"). Success is never faked, and the caller's values are left untouched on error.
// The guard (one post at a time, nothing after success, retry after failure, no state updates after
// unmount) is createSubmitter in src/lib/formPost.ts, which is tested.
export function useFormPost<V extends FormValues>({ endpoint, validate, onSuccess }: Options<V>) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const available = canSubmit(endpoint);

  // Latest props, read by the submitter on each call, so a re-render never resubmits or goes stale.
  const latest = useRef({ endpoint, validate, onSuccess });
  useLayoutEffect(() => {
    latest.current = { endpoint, validate, onSuccess };
  });

  const [submitter] = useState(() =>
    createSubmitter<V>(
      (): SubmitterOptions<V> => ({
        validate: (values) => latest.current.validate(values),
        post: (values) =>
          postJson((url, init) => fetch(url, init), latest.current.endpoint, buildPayload(values, getUtmParams())),
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

  const submit = useCallback(
    async (values: V): Promise<boolean> => {
      if (!canSubmit(latest.current.endpoint)) return false;
      return (await submitter.submit(values)) === 'ok';
    },
    [submitter]
  );

  return {
    available,
    status,
    errors,
    submit,
    errorMessage: status === 'error' ? submitErrorMessage(siteConfig.contactEmail) : null
  };
}
