// Per-page variants of the proof section (spec §6.4, §6A.3). Framework-free and tested.
// - "What we won't do": each line uses its /home wording on /home when it has one, then goes through the
//   sign-off gate (renderLine), so a gated line hides on both pages until it's signed off.
// - Headings that differ per page are a Record<Audience, string>, so a missing page is a compile error.
import type { Audience, WontDoLine } from '../data/copy/types';
import { signoff as repoSignoff } from '../data/signoff';
import type { Signoff } from '../data/signoff';
import { renderLine } from './claims';

export function resolveWontDo(lines: readonly WontDoLine[], audience: Audience, signoff: Signoff = repoSignoff): string[] {
  return lines
    .map(({ home, ...line }) => renderLine(audience === 'home' && home?.trim() ? { ...line, text: home } : line, signoff))
    .filter((line): line is string => line !== null);
}

export function headingFor(headings: Readonly<Record<Audience, string>>, audience: Audience): string {
  return headings[audience];
}
