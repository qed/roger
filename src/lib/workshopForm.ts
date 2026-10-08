// Workshop request form rules (spec §6B.7, R12b). Framework-free and tested; WorkshopRequestForm renders
// it and useFormPost posts it (buildPostBody shapes it, adds the UTM fields and drops empty values).
import { workshopFormCopy } from '../data/copy/workshops';
import { EMAIL_MAX_LENGTH, buildPostBody, isValidEmail } from './formPost';
import type { FormErrors, FormValues, LooseValues } from './formPost';

// Field names, in the order they render. The first one with an error gets focus on a failed submit.
export const WORKSHOP_FIELDS = ['organisation', 'name', 'email', 'phone', 'groupType', 'size', 'month', 'format', 'notes'] as const;
export type WorkshopField = (typeof WORKSHOP_FIELDS)[number];
export type WorkshopValues = Record<WorkshopField, string>;

export const REQUIRED_WORKSHOP_FIELDS: readonly WorkshopField[] = ['organisation', 'name', 'email'];
export const WORKSHOP_SIZE_MIN = 1;
export const WORKSHOP_SIZE_MAX = 500;

// Length caps: the inputs carry them as maxLength and validateWorkshop enforces them (after trimming).
// Group type and format are option lists, so they have none.
export const WORKSHOP_MAX_LENGTH = {
  organisation: 120,
  name: 120,
  email: EMAIL_MAX_LENGTH,
  phone: 120,
  size: 3,
  month: 120,
  notes: 2000
} as const satisfies Partial<Record<WorkshopField, number>>;
type CappedField = keyof typeof WORKSHOP_MAX_LENGTH;
const CAPPED_FIELDS = Object.keys(WORKSHOP_MAX_LENGTH) as CappedField[];

// The payload's keys (what the endpoint receives), one per field.
export const WORKSHOP_PAYLOAD_KEYS: Readonly<Record<WorkshopField, string>> = {
  organisation: 'organisation',
  name: 'name',
  email: 'email',
  phone: 'phone',
  groupType: 'group_type',
  size: 'expected_size',
  month: 'preferred_month',
  format: 'format',
  notes: 'notes'
};

const GROUP_TYPES = new Set<string>(workshopFormCopy.groupTypes.map((g) => g.value));
const FORMATS = new Set<string>(workshopFormCopy.formats.map((f) => f.value));
const WHOLE_NUMBER = /^\d+$/;

export function emptyWorkshopValues(): WorkshopValues {
  return Object.fromEntries(WORKSHOP_FIELDS.map((f) => [f, ''])) as WorkshopValues;
}

// Field → message. Required fields must be non-blank after trimming; email must look like an email;
// size is optional but, when given, a whole number from 1 to 500. Phone, month and notes are free text.
// Every capped field must fit its WORKSHOP_MAX_LENGTH (a too-long size gets the size error).
export function validateWorkshop(values: Partial<WorkshopValues>): FormErrors {
  const v = (field: WorkshopField) => (values[field] ?? '').trim();
  const errors: FormErrors = {};
  if (!v('organisation')) errors.organisation = workshopFormCopy.errors.organisation;
  if (!v('name')) errors.name = workshopFormCopy.errors.name;
  if (!isValidEmail(v('email'))) errors.email = workshopFormCopy.errors.email;
  const size = v('size');
  if (size) {
    const n = Number(size);
    if (!WHOLE_NUMBER.test(size) || n < WORKSHOP_SIZE_MIN || n > WORKSHOP_SIZE_MAX) errors.size = workshopFormCopy.errors.size;
  }
  for (const field of CAPPED_FIELDS) {
    if (v(field).length <= WORKSHOP_MAX_LENGTH[field]) continue;
    errors[field] = field === 'size' ? workshopFormCopy.errors.size : workshopFormCopy.errors.tooLong[field];
  }
  return errors;
}

// The first field (in render order) carrying an error, or null.
export function firstErrorField(errors: FormErrors): WorkshopField | null {
  return WORKSHOP_FIELDS.find((f) => errors[f]) ?? null;
}

// Form values → the fields the endpoint receives, before UTM. Trims, maps to payload keys, drops a
// group type or format that isn't one of the options, and writes the size without leading zeros.
// Empty values stay empty here; buildPayload omits them.
export function shapeWorkshopValues(values: Partial<WorkshopValues>): FormValues {
  const out: FormValues = {};
  for (const field of WORKSHOP_FIELDS) {
    let value = (values[field] ?? '').trim();
    if (field === 'groupType' && !GROUP_TYPES.has(value)) value = '';
    if (field === 'format' && !FORMATS.has(value)) value = '';
    if (field === 'size' && WHOLE_NUMBER.test(value)) value = value.replace(/^0+(?=\d)/, '');
    out[WORKSHOP_PAYLOAD_KEYS[field]] = value;
  }
  return out;
}

// What the form POSTs: the shaped fields plus the UTM params, empty values omitted.
// The same composition useFormPost runs (buildPostBody with this shape).
export function workshopPayload(values: Partial<WorkshopValues>, utm: LooseValues = {}): FormValues {
  return buildPostBody(values, utm, shapeWorkshopValues);
}
