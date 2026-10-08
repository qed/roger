import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { siteConfig } from '../../data/config';
import { ctaLabels } from '../../data/copy/shared';
import { workshopFormCopy as copy } from '../../data/copy/workshops';
import { REQUIRED_WORKSHOP_FIELDS, WORKSHOP_MAX_LENGTH, emptyWorkshopValues, firstErrorField, shapeWorkshopValues, validateWorkshop } from '../../lib/workshopForm';
import type { WorkshopField, WorkshopValues } from '../../lib/workshopForm';
import { trackEvent } from '../../utils/analytics';
import { ctaClassName } from '../cta/ctaStyles';
import { Honeypot } from './Honeypot';
import { useFormPost } from './useFormPost';

const inputClass = (invalid: boolean) =>
  `mt-2 block min-h-[44px] w-full rounded-xl border bg-paper px-4 py-2.5 text-base text-ink placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-70 ${
    invalid ? 'border-copper' : 'border-rule'
  }`;

// Spec §6B.7 (R12b, §10 a11y): labelled fields with required markers, inline errors tied to their field
// (aria-invalid + aria-describedby), focus on the first error, UTM fields added on submit. Empty endpoint →
// fields and button disabled, "Opening soon"; success only on a real 2xx. While posting, the button stays
// focusable (aria-disabled) and the status region says "Sending…"; a failed post moves focus to the error.
export function WorkshopRequestForm() {
  const [values, setValues] = useState<WorkshopValues>(emptyWorkshopValues);
  const onSuccess = useCallback(() => trackEvent('workshop_request_submit'), []);
  const { available, status, errors, submit, errorMessage, buttonState, liveText, statusRef, honeypotRef } = useFormPost<WorkshopValues>({
    endpoint: siteConfig.forms.workshopEndpoint,
    validate: validateWorkshop,
    shape: shapeWorkshopValues,
    submittingText: copy.submitting,
    onSuccess
  });
  const id = useId();
  const fieldId = (field: WorkshopField) => `${id}-${field}`;
  const errorId = (field: WorkshopField) => `${id}-${field}-error`;
  const statusId = `${id}-status`;
  const contactEmail = siteConfig.contactEmail.trim();

  // After a failed validation, move focus to the first field with an error (once the errors render).
  const focusFirstError = useRef(false);
  useEffect(() => {
    if (!focusFirstError.current) return;
    focusFirstError.current = false;
    const field = firstErrorField(errors);
    const el = field ? document.getElementById(fieldId(field)) : null;
    if (!el) return;
    // Centre it, so the sticky header never covers the field or its error.
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center' });
    // fieldId is derived from the stable useId value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  // The success message replaces the form; move focus to it so keyboard users aren't dropped on <body>.
  const successRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const set = (field: WorkshopField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return; // the button is aria-disabled, not disabled; ignore a second activation
    focusFirstError.current = true;
    void submit(values);
  };

  if (status === 'success') {
    return (
      <p ref={successRef} tabIndex={-1} role="status" className="rounded-2xl border border-rule bg-cream p-6 font-serif text-2xl leading-snug text-ink outline-none">
        {copy.success}
      </p>
    );
  }

  // One labelled control with its required marker and inline error.
  const field = (name: WorkshopField, control: (a11y: Record<string, string | boolean | undefined>) => ReactNode) => {
    const required = REQUIRED_WORKSHOP_FIELDS.includes(name);
    const error = errors[name];
    return (
      <div>
        <label htmlFor={fieldId(name)} className="block text-sm font-medium text-ink">
          {copy.labels[name]}
          {required && (
            <>
              {' '}
              <span aria-hidden="true" className="text-copper">
                {copy.requiredMark}
              </span>
            </>
          )}
        </label>
        {control({
          id: fieldId(name),
          name,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId(name) : undefined,
          'aria-required': required ? true : undefined
        })}
        {error && (
          <p id={errorId(name)} className="mt-2 text-sm text-copper">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-rule bg-cream p-5 sm:p-8">
      <p className="text-sm text-ink-soft">{copy.requiredNote}</p>
      <Honeypot ref={honeypotRef} />
      <fieldset disabled={!available} className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {field('organisation', (a) => (
            <input {...a} type="text" autoComplete="organization" maxLength={WORKSHOP_MAX_LENGTH.organisation} value={values.organisation} onChange={set('organisation')} className={inputClass(!!errors.organisation)} />
          ))}
        </div>
        {field('name', (a) => (
          <input {...a} type="text" autoComplete="name" maxLength={WORKSHOP_MAX_LENGTH.name} value={values.name} onChange={set('name')} className={inputClass(!!errors.name)} />
        ))}
        {field('email', (a) => (
          <input
            {...a}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.placeholders.email}
            maxLength={WORKSHOP_MAX_LENGTH.email}
            value={values.email}
            onChange={set('email')}
            className={inputClass(!!errors.email)}
          />
        ))}
        {field('phone', (a) => (
          <input {...a} type="tel" autoComplete="tel" maxLength={WORKSHOP_MAX_LENGTH.phone} value={values.phone} onChange={set('phone')} className={inputClass(!!errors.phone)} />
        ))}
        {field('groupType', (a) => (
          <select {...a} value={values.groupType} onChange={set('groupType')} className={inputClass(!!errors.groupType)}>
            <option value="">{copy.groupTypeChoose}</option>
            {copy.groupTypes.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        ))}
        {field('size', (a) => (
          <input
            {...a}
            type="text"
            inputMode="numeric"
            placeholder={copy.placeholders.size}
            maxLength={WORKSHOP_MAX_LENGTH.size}
            value={values.size}
            onChange={set('size')}
            className={inputClass(!!errors.size)}
          />
        ))}
        {field('month', (a) => (
          <input {...a} type="text" placeholder={copy.placeholders.month} maxLength={WORKSHOP_MAX_LENGTH.month} value={values.month} onChange={set('month')} className={inputClass(!!errors.month)} />
        ))}
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-ink">{copy.labels.format}</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {copy.formats.map((f) => (
              <label key={f.value} className="inline-flex min-h-[44px] cursor-pointer items-center gap-3 text-base text-ink">
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={values.format === f.value}
                  onChange={set('format')}
                  className="h-5 w-5 accent-copper"
                />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          {field('notes', (a) => (
            <textarea {...a} rows={4} placeholder={copy.placeholders.notes} maxLength={WORKSHOP_MAX_LENGTH.notes} value={values.notes} onChange={set('notes')} className={inputClass(!!errors.notes)} />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={buttonState.disabled}
          aria-disabled={buttonState.ariaDisabled || undefined}
          className={ctaClassName({
            variant: 'primary',
            size: 'lg',
            live: available,
            className: `self-start ${buttonState.ariaDisabled ? 'cursor-progress opacity-80' : ''}`
          })}>
          {buttonState.label === 'openingSoon' ? ctaLabels.openingSoon : buttonState.label === 'submitting' ? copy.submitting : copy.submit}
        </button>
        {!available && <p className="text-sm text-ink-soft">{copy.closedNote(contactEmail)}</p>}
      </div>
      <p
        ref={statusRef}
        id={statusId}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={`text-sm outline-none ${errorMessage ? 'text-copper' : 'text-ink-soft'} ${liveText ? 'mt-4' : ''}`}>
        {liveText}
      </p>
    </form>
  );
}
