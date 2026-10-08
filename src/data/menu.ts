// The menus (spec §4). Framework-free. Copy is a draft Peter can edit.
// Tool names stay plain text; don't promise specific integrations.
import { library } from './library';
import type { UseCaseCategory } from './library';

export type MenuKind = 'work' | 'home';

export type MenuItem = {
  id: string;
  title: string;
  outcome: string; // the headline
  how: string; // one line
  libraryCategory: UseCaseCategory;
};

export type ChiefOfStaff = MenuItem & { points: string[] };

// §4.1 Always included with the work setup.
export const chiefOfStaff: ChiefOfStaff = {
  id: 'work-cos',
  title: 'Chief of Staff',
  outcome: 'The day starts handled.',
  how: 'Morning brief before 7am: open loops from email, calendar and tasks.',
  libraryCategory: 'chief-of-staff',
  points: [
    'Morning brief before 7am: open loops from email, calendar and tasks.',
    'Every email starts as a draft, with your availability checked and attachments found.',
    "One task list, where the assistant logs what it's stuck on.",
    'After meetings, decisions and follow-ups go onto the list.'
  ]
};

// §4.2 Helpers: pick 3 of 8.
export const helpers: MenuItem[] = [
  {
    id: 'work-customers',
    title: 'Customer messages',
    outcome: 'No customer waits until Monday.',
    how: 'Checks the inbox and every DM platform each morning, flags anything missed and drafts replies.',
    libraryCategory: 'customers'
  },
  {
    id: 'work-invoices',
    title: 'Invoices and bookkeeping',
    outcome: 'Get paid without chasing.',
    how: 'Creates invoices, chases overdue ones and files receipts.',
    libraryCategory: 'bookkeeping'
  },
  {
    id: 'work-scheduling',
    title: 'Scheduling and bookings',
    outcome: 'A full calendar without the back-and-forth.',
    how: 'Books, confirms, reschedules and fills cancellations.',
    libraryCategory: 'customers'
  },
  {
    id: 'work-leads',
    title: 'Lead follow-up',
    outcome: 'Every lead hears back the same day.',
    how: 'Drafts replies and books calls.',
    libraryCategory: 'solo'
  },
  {
    id: 'work-social',
    title: 'Social and reviews',
    outcome: 'Show up online without giving up your evenings.',
    how: 'Drafts posts and replies to Google reviews.',
    libraryCategory: 'marketing'
  },
  {
    id: 'work-staff',
    title: 'Staff and shifts',
    outcome: 'Shift swaps sorted without you in the middle.',
    how: 'Shift schedules, swaps and onboarding documents.',
    libraryCategory: 'staff'
  },
  {
    id: 'work-suppliers',
    title: 'Suppliers and inventory',
    outcome: 'Never run out of what sells.',
    how: 'Reorder reminders and supplier emails.',
    libraryCategory: 'shop-ops'
  },
  {
    id: 'work-numbers',
    title: 'Weekly numbers',
    outcome: 'Know where you stand by Monday at 8.',
    how: 'A one-pager of sales, bookings and cash in, pulled from your tools.',
    libraryCategory: 'bookkeeping'
  }
];

// §4.3 Home jobs: pick 5 of 12 (/home only). Titles are short labels derived from the outcome/how
// (the spec gives none); they feed the summary panel and the Cal `picks` value.
export const homeJobs: MenuItem[] = [
  {
    id: 'home-meal-plan',
    title: 'Meal plan',
    outcome: 'Never answer "what\'s for dinner?" again.',
    how: 'Dinners planned around your calendar; the cart built with your brands.',
    libraryCategory: 'household'
  },
  {
    id: 'home-family-brief',
    title: 'Family brief',
    outcome: 'Everyone out the door on time.',
    how: "Who's where, what's due and the weather, before breakfast.",
    libraryCategory: 'chief-of-staff'
  },
  {
    id: 'home-school-digest',
    title: 'School digest',
    outcome: 'Never miss a form or a pizza day.',
    how: 'Forms, dates and deadlines pulled out of the school emails.',
    libraryCategory: 'kids'
  },
  {
    id: 'home-inbox',
    title: 'Inbox clean-up',
    outcome: "An inbox you're not afraid to open.",
    how: 'Years of clutter sorted, then a daily triage.',
    libraryCategory: 'chief-of-staff'
  },
  {
    id: 'home-bills',
    title: 'Bill check',
    outcome: "Stop paying for things you don't use.",
    how: 'Finds recurring charges you forgot about.',
    libraryCategory: 'money'
  },
  {
    id: 'home-money-finder',
    title: 'Money finder',
    outcome: "Find money you're already owed.",
    how: 'Refunds, gift-card balances and loyalty claims buried in old email.',
    libraryCategory: 'money'
  },
  {
    id: 'home-maintenance',
    title: 'Home maintenance',
    outcome: 'Know your filter size without climbing into the basement.',
    how: 'Photograph each appliance once; get manuals, schedules and parts.',
    libraryCategory: 'household'
  },
  {
    id: 'home-errands',
    title: 'Errands and bookings',
    outcome: 'Appointments booked from a screenshot.',
    how: 'Oil changes, appointments and reservations.',
    libraryCategory: 'errands'
  },
  {
    id: 'home-trip',
    title: 'Trip planning',
    outcome: 'Better trips, less tab-hopping.',
    how: 'Compares prices; builds the itinerary and leave-by alerts.',
    libraryCategory: 'travel'
  },
  {
    id: 'home-scam-guard',
    title: 'Scam guard',
    outcome: "Peace of mind about Mom's inbox.",
    how: 'Flags phishing, impersonation and fake invoices.',
    libraryCategory: 'caregiving'
  },
  {
    id: 'home-kids-practice',
    title: "Kids' practice",
    outcome: 'Practice that matches what they missed today.',
    how: 'A custom worksheet each morning.',
    libraryCategory: 'kids'
  },
  {
    id: 'home-big-purchase',
    title: 'Big-purchase search',
    outcome: 'The right deal finds you.',
    how: 'Searches every morning against your rules (e.g. a car under $35K).',
    libraryCategory: 'chief-of-staff'
  }
];

export const menuItems: MenuItem[] = [chiefOfStaff, ...helpers, ...homeJobs];

export function menuKind(item: Pick<MenuItem, 'id'>): MenuKind {
  return item.id.startsWith('home-') ? 'home' : 'work';
}

export function findMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

// "See real examples →" link for a menu item (spec §4 rule). Derived from the library data:
// if the item's category has no entries for its audience yet, link to the audience-wide list instead
// of an empty category. Home items carry for=home so the library opens on home examples.
export function exampleHref(item: Pick<MenuItem, 'id' | 'libraryCategory'>): string {
  const kind = menuKind(item);
  const hasExamples = library.some((entry) => entry.category === item.libraryCategory && entry.for === kind);
  if (!hasExamples) return `/library?for=${kind}`;
  return kind === 'home' ? `/library?cat=${item.libraryCategory}&for=home` : `/library?cat=${item.libraryCategory}`;
}
