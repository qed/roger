// `/library` copy (spec §7.3, §10). The header, subhead, card link labels and honest-miss tag are verbatim
// from the spec; the rest is a draft for Peter to approve. No amounts or other claims of our own here:
// the numbers in library summaries are what third parties reported, credited and linked (spec §7).
import type { UseCaseCategory } from '../library';

export const libraryMeta = {
  title: 'Real AI assistant use cases · Roger',
  description:
    'Real-world AI assistant use cases, collected weekly from public posts. Each one is credited and links to the original.'
};

export const libraryCopy = {
  heading: 'Real-world AI assistant use cases.',
  subhead: 'Collected weekly from public posts. Not Roger clients. Each one links to the original.',
  filtersLabel: 'Filter the use cases',
  audienceLabel: 'Show use cases for',
  audiences: [
    { value: 'all', label: 'All' },
    { value: 'work', label: 'Work' },
    { value: 'home', label: 'Home' }
  ] as const,
  categoryLabel: 'Category',
  allCategories: 'All categories',
  searchLabel: 'Search',
  searchPlaceholder: 'Try "invoices" or "meal plan"',
  resultsHeading: 'Use cases',
  count: (shown: number, total: number) =>
    shown === 0
      ? 'No use cases match yet.'
      : shown === total
        ? `Showing all ${total} use cases.`
        : `Showing ${shown} of ${total} ${total === 1 ? 'use case' : 'use cases'}.`,
  empty: 'No use cases match yet.',
  clear: 'See every example',
  readOriginal: 'Read the original ↗',
  newTab: ' (opens in a new tab)',
  setUp: 'I can set this up for you →',
  honestMiss: "Didn't go as planned.",
  via: 'via',
  bandHeading: 'Want one of these running for you?',
  bandBody: "Book a free 20-minute fit call. I'll tell you what's realistic for your business.",
  newsletterHeading: 'Get 5 real AI-assistant use cases every week.'
};

export const categoryLabels: Record<UseCaseCategory, string> = {
  kids: 'Kids',
  household: 'Household',
  'chief-of-staff': 'Chief of Staff',
  solo: 'Solo business',
  money: 'Money',
  travel: 'Travel',
  caregiving: 'Caregiving',
  errands: 'Errands',
  customers: 'Customers',
  marketing: 'Marketing',
  bookkeeping: 'Bookkeeping',
  staff: 'Staff',
  'shop-ops': 'Shop operations'
};
