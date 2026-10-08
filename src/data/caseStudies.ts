// Pilot case studies (spec §6.4). Framework-free; the launch check reads this file.
// Never invent an entry. Each one needs the client's written permission, a measured before/after
// from their setup report and a real quote. The proof section hides while this list is empty.

export type CaseStudyMetric = { label: string; before: string; after: string };

export type CaseStudy = {
  id: string;
  name: string;
  role: string;
  business: string;
  businessType: string;
  photo?: string;
  logo?: string;
  for: 'home' | 'work';
  before: string; // the problem, in their words
  setUp: string[]; // menu ids from spec §4
  metrics: CaseStudyMetric[]; // ≥1, from the setup report
  quote: string;
  permission: true; // must be literally true to render
  date: string; // ISO date
};

export const caseStudies: CaseStudy[] = [];
