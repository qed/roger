import { forwardRef, useId } from 'react';
import { formCopy } from '../../data/copy/shared';
import { HONEYPOT_FIELD } from '../../lib/formPost';

// The spam trap (see honeypotTripped in src/lib/formPost.ts): visually hidden, hidden from assistive
// tech, out of the tab order and never autofilled. useFormPost reads its value on submit.
export const Honeypot = forwardRef<HTMLInputElement>(function Honeypot(_props, ref) {
  const id = useId();
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor={id}>{formCopy.honeypotLabel}</label>
      <input ref={ref} id={id} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
});
