// `/workshops` copy (spec §6B, §3.3). For hosts: BIA managers, association leads, school councils.
// Roger's "we" voice (owner decision, 2026-10-08), Canadian spelling. The title, hero headline and
// subhead, the host-pack label and the success line are spec text (moved to "we"); the rest is a draft for Peter to approve.
// No amounts on this page: the member discount is described, not priced ("a 14-day member discount on a
// setup", spec §6B.2). The amounts live in Stripe and on the offer pages, so nothing here goes stale.

export const workshopsMeta = {
  title: 'Free AI assistant workshop for your members · Roger',
  description:
    'A free, live AI assistant workshop for BIAs, business associations, chambers and school communities in Toronto or on Zoom. We set up a real assistant, start to finish, in front of your members.'
};

// §6B.1 Hero
export const workshopsHeroCopy = {
  eyebrow: 'Free workshops · Toronto and Zoom',
  headline: 'Give your members a free, live AI assistant workshop.',
  subhead:
    'In 60 minutes we set up a real AI assistant live, start to finish, and show your members what it can take off their plate. Free for BIAs, associations and school communities.',
  cta: 'Request a date'
};

// The request form's section id; the hero CTA scrolls here.
export const WORKSHOP_REQUEST_ID = 'request';

// §6B.2 What your members get
export const workshopsMembersGetCopy = {
  heading: 'What your members get',
  items: [
    {
      title: 'The live build',
      body: 'We set up one real AI assistant in front of the room, start to finish, and answer questions as we go.'
    },
    {
      title: 'A starter checklist',
      body: 'A one-page checklist they can take home and work through on their own.'
    },
    {
      title: 'A 14-day member discount on a setup',
      body: 'A code for your group that takes money off our business or home setup, if anyone wants us to do it for them.'
    }
  ]
};

// §6B.3 What you provide
export const workshopsProvideCopy = {
  heading: 'What you provide',
  body: "A room (or a Zoom link) and 10–40 people. That's it."
};

// §6B.4 Formats
export const workshopsFormatsCopy = {
  heading: 'Formats',
  items: ['60 or 90 min', 'In person in Toronto or on Zoom', 'Evenings or breakfast']
};

// §6B.5 Host pack (shown only when config.workshopHostPack is set)
export const workshopsHostPackCopy = {
  heading: 'For your board or newsletter',
  body: 'A one-pager you can forward: what the workshop is, a blurb for your newsletter, and the logistics.',
  link: 'Download the one-page host pack (PDF)',
  newTab: ' (opens in a new tab)'
};

// §6B.6 Proof (hidden when there are no endorsements and no workshops yet)
export const workshopsProofCopy = {
  heading: 'From hosts'
};

// §6B.7 Request form
export const workshopFormCopy = {
  heading: 'Request a date',
  intro: "Tell us a little about your group and we'll reply to find a date that works.",
  requiredNote: 'Fields marked * are required.',
  requiredMark: '*',
  labels: {
    organisation: 'Organisation',
    name: 'Your name',
    email: 'Email',
    phone: 'Phone',
    groupType: 'Group type',
    size: 'Expected size',
    month: 'Preferred month',
    format: 'In person or Zoom',
    notes: 'Notes'
  },
  placeholders: {
    email: 'you@example.ca',
    size: 'Number of people',
    month: 'e.g. November',
    notes: 'Anything we should know: the audience, the venue, dates that work.'
  },
  groupTypeChoose: 'Choose one',
  groupTypes: [
    { value: 'bia', label: 'BIA' },
    { value: 'business-association', label: 'Business association' },
    { value: 'chamber', label: 'Chamber' },
    { value: 'school', label: 'School or parent community' },
    { value: 'other', label: 'Other' }
  ],
  formats: [
    { value: 'in-person', label: 'In person (Toronto)' },
    { value: 'zoom', label: 'Zoom' }
  ],
  errors: {
    organisation: 'Enter the name of your organisation.',
    name: 'Enter your name.',
    email: 'Enter a valid email address, like name@example.ca.',
    size: 'Enter the number of people as a whole number, from 1 to 500.',
    // One per length cap (WORKSHOP_MAX_LENGTH in src/lib/workshopForm.ts; a test keeps the numbers in step).
    tooLong: {
      organisation: 'Keep the organisation name to 120 characters or fewer.',
      name: 'Keep your name to 120 characters or fewer.',
      email: 'Keep the email address to 254 characters or fewer.',
      phone: 'Keep the phone number to 120 characters or fewer.',
      month: 'Keep the preferred month to 120 characters or fewer.',
      notes: 'Keep the notes to 2,000 characters or fewer.'
    }
  },
  submit: 'Send request',
  submitting: 'Sending…',
  success: "Thanks. We'll reply within 1 business day to find a date.",
  // While no form endpoint is configured, the form is replaced by an email link (owner decision,
  // 2026-10-09): the body lists the fields the form would have asked for.
  emailFallback: {
    intro: "Email us your group's name, roughly how many people, and a month that works. We'll reply within 1 business day to find a date.",
    button: 'Email us to request a date',
    subject: 'Workshop request',
    body: 'Organisation:\nYour name:\nPhone:\nGroup type (BIA, business association, chamber, school, other):\nExpected size:\nPreferred month:\nIn person (Toronto) or Zoom:\nNotes:\n'
  },
  // Shown under the disabled "Opening soon" button when there is neither an endpoint nor a contact email.
  closedNote: (contactEmail: string) =>
    contactEmail ? `Requests open soon. In the meantime, email ${contactEmail}.` : 'Requests open soon.'
};
