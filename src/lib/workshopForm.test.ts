import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { workshopFormCopy } from '../data/copy/workshops.ts';
import { buildPostBody } from './formPost.ts';
import {
  REQUIRED_WORKSHOP_FIELDS,
  WORKSHOP_FIELDS,
  WORKSHOP_MAX_LENGTH,
  emptyWorkshopValues,
  firstErrorField,
  shapeWorkshopValues,
  validateWorkshop,
  workshopPayload
} from './workshopForm.ts';
import type { WorkshopValues } from './workshopForm.ts';

// 64 + 1 + EMAIL_DOMAIN_LEN + 3 (".ca") = 254 characters.
const EMAIL_DOMAIN_LEN = 254 - 64 - 1 - 3;

const valid = (over: Partial<WorkshopValues> = {}): WorkshopValues => ({
  ...emptyWorkshopValues(),
  organisation: 'Ossington BIA',
  name: 'Jane Doe',
  email: 'jane@ossington.ca',
  ...over
});

describe('validateWorkshop (spec §6B.7)', () => {
  it('accepts the three required fields alone', () => {
    assert.deepEqual(validateWorkshop(valid()), {});
  });

  it('accepts every field filled in', () => {
    const all = valid({
      phone: '416 555 0100',
      groupType: 'bia',
      size: '25',
      month: 'November',
      format: 'zoom',
      notes: 'Breakfast works best.'
    });
    assert.deepEqual(validateWorkshop(all), {});
  });

  it('gives a field-specific error for each missing required field', () => {
    const errors = validateWorkshop(emptyWorkshopValues());
    assert.deepEqual(Object.keys(errors).sort(), ['email', 'name', 'organisation']);
    assert.equal(errors.organisation, workshopFormCopy.errors.organisation);
    assert.equal(errors.name, workshopFormCopy.errors.name);
    assert.equal(errors.email, workshopFormCopy.errors.email);
    for (const field of REQUIRED_WORKSHOP_FIELDS) {
      assert.deepEqual(Object.keys(validateWorkshop(valid({ [field]: '' }))), [field], field);
    }
  });

  it('treats whitespace-only required fields as missing', () => {
    assert.deepEqual(Object.keys(validateWorkshop(valid({ organisation: '   ', name: '\t' }))).sort(), ['name', 'organisation']);
  });

  it('rejects an invalid email with the email error only', () => {
    for (const email of ['jane', 'jane@', 'jane@ossington', 'ja ne@x.ca']) {
      assert.deepEqual(validateWorkshop(valid({ email })), { email: workshopFormCopy.errors.email }, email);
    }
    assert.deepEqual(validateWorkshop(valid({ email: '  jane@ossington.ca ' })), {});
  });

  it('allows an empty size, but a given size must be a whole number from 1 to 500', () => {
    for (const size of ['', '  ', '1', '40', ' 500 ']) assert.deepEqual(validateWorkshop(valid({ size })), {}, `"${size}"`);
    for (const size of ['0', '501', '-5', '2.5', '25 people', 'twenty', '1e2']) {
      assert.deepEqual(validateWorkshop(valid({ size })), { size: workshopFormCopy.errors.size }, size);
    }
  });

  it('caps each free-text field at its maxLength, with a field-specific error', () => {
    assert.deepEqual(WORKSHOP_MAX_LENGTH, { organisation: 120, name: 120, email: 254, phone: 120, size: 3, month: 120, notes: 2000 });
    const long = (n: number) => 'x'.repeat(n);
    for (const field of ['organisation', 'name', 'phone', 'month', 'notes'] as const) {
      const cap = WORKSHOP_MAX_LENGTH[field];
      assert.deepEqual(validateWorkshop(valid({ [field]: long(cap) })), {}, `${field} at the cap`);
      assert.deepEqual(validateWorkshop(valid({ [field]: ` ${long(cap)} ` })), {}, `${field} at the cap, padded`);
      assert.deepEqual(validateWorkshop(valid({ [field]: long(cap + 1) })), { [field]: workshopFormCopy.errors.tooLong[field] }, `${field} over`);
    }
    const local = 'a'.repeat(64);
    const domain = `${'b'.repeat(EMAIL_DOMAIN_LEN)}.ca`;
    assert.equal(`${local}@${domain}`.length, 254);
    assert.deepEqual(validateWorkshop(valid({ email: `${local}@${domain}` })), {}, 'email at 254');
    assert.deepEqual(validateWorkshop(valid({ email: `${local}@b${domain}` })), { email: workshopFormCopy.errors.tooLong.email }, 'email at 255');
    assert.deepEqual(validateWorkshop(valid({ size: '0025' })), { size: workshopFormCopy.errors.size }, 'size over 3 characters');
  });

  it('states each cap in its error copy', () => {
    for (const [field, message] of Object.entries(workshopFormCopy.errors.tooLong)) {
      const cap: number = WORKSHOP_MAX_LENGTH[field as keyof typeof WORKSHOP_MAX_LENGTH];
      assert.ok(message.includes(`${cap.toLocaleString('en-CA')} characters`), `${field}: "${message}"`);
    }
  });

  it('never requires phone, group type, month, format or notes', () => {
    const optional = WORKSHOP_FIELDS.filter((f) => !REQUIRED_WORKSHOP_FIELDS.includes(f));
    assert.deepEqual(optional, ['phone', 'groupType', 'size', 'month', 'format', 'notes']);
    assert.deepEqual(validateWorkshop({ organisation: 'A', name: 'B', email: 'c@d.ca' }), {});
  });
});

describe('firstErrorField', () => {
  it('follows render order, not the order errors were added', () => {
    assert.equal(firstErrorField({ email: 'x', organisation: 'y' }), 'organisation');
    assert.equal(firstErrorField({ size: 'x', email: 'y' }), 'email');
    assert.equal(firstErrorField({}), null);
  });
});

describe('workshopPayload', () => {
  it('sends every field under its payload key, trimmed, with the UTM params', () => {
    const payload = workshopPayload(
      valid({
        organisation: '  Ossington BIA ',
        phone: '416 555 0100',
        groupType: 'bia',
        size: '025',
        month: ' November ',
        format: 'in-person',
        notes: 'Evenings, please.'
      }),
      { utm_source: 'bia-ossington', utm_medium: 'email', utm_campaign: undefined }
    );
    assert.deepEqual(payload, {
      utm_source: 'bia-ossington',
      utm_medium: 'email',
      organisation: 'Ossington BIA',
      name: 'Jane Doe',
      email: 'jane@ossington.ca',
      phone: '416 555 0100',
      group_type: 'bia',
      expected_size: '25',
      preferred_month: 'November',
      format: 'in-person',
      notes: 'Evenings, please.'
    });
  });

  it('omits empty optional fields without failing', () => {
    assert.deepEqual(workshopPayload(valid()), {
      organisation: 'Ossington BIA',
      name: 'Jane Doe',
      email: 'jane@ossington.ca'
    });
  });

  it('is exactly what useFormPost posts: buildPostBody with shapeWorkshopValues', () => {
    const values = valid({ size: '7', notes: ' hi ' });
    const utm = { utm_source: 'qr' };
    assert.deepEqual(workshopPayload(values, utm), buildPostBody(values, utm, shapeWorkshopValues));
  });

  it('writes the size without leading zeros, keeping a lone zero', () => {
    assert.equal(shapeWorkshopValues(valid({ size: '007' })).expected_size, '7');
    assert.equal(shapeWorkshopValues(valid({ size: '100' })).expected_size, '100');
    assert.equal(shapeWorkshopValues(valid({ size: '000' })).expected_size, '0');
    assert.equal(shapeWorkshopValues(valid({ size: '25 people' })).expected_size, '25 people');
  });

  it('drops a group type or format that is not one of the options', () => {
    const payload = workshopPayload(valid({ groupType: 'cult', format: 'carrier pigeon' }));
    assert.equal('group_type' in payload, false);
    assert.equal('format' in payload, false);
  });

  it('never lets a UTM param overwrite a form field', () => {
    assert.equal(workshopPayload(valid(), { email: 'utm@x.ca', utm_source: 'qr' } as Record<string, string>).email, 'jane@ossington.ca');
  });
});

describe('workshop form options', () => {
  it('offers exactly the spec group types and formats', () => {
    assert.deepEqual(
      workshopFormCopy.groupTypes.map((g) => g.label),
      ['BIA', 'Business association', 'Chamber', 'School or parent community', 'Other']
    );
    assert.deepEqual(workshopFormCopy.formats.map((f) => f.value), ['in-person', 'zoom']);
  });

  it('keeps every option the form offers', () => {
    for (const g of workshopFormCopy.groupTypes) assert.equal(shapeWorkshopValues(valid({ groupType: g.value })).group_type, g.value);
    for (const f of workshopFormCopy.formats) assert.equal(shapeWorkshopValues(valid({ format: f.value })).format, f.value);
  });
});
