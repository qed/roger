// Sign-offs (spec §8.4.1): claims and decisions code can't verify.
// Flip to true only when it's actually true. One commit per flip: "signoff: <key>".
// Framework-free; the launch check reads this file.
export const signoff = {
  legalReviewed: false, // Terms, Privacy, Refunds reviewed
  hstConfirmed: false, // taxNote wording confirmed with an accountant
  noReferralFees: false, // "We don't take referral fees from AI companies" is true
  passwordPolicy: false, // "We never keep your passwords; we remove our access at handover" is true
  futurePriceCommitted: false, // will honour "$3,000 / $750 after the first 10 clients"
  bioApproved: false, // About bio text approved
  foundingPerkConfirmed: false, // 60-day tune-up is the founding perk
  homeSessionLeadConfirmed: false, // can promise a home session within 3 business days
  libraryVerified: false, // every library URL checked and resolving
  workshopsBooked: 0 // number of workshops on the calendar (gate needs ≥ 2)
};

export type Signoff = typeof signoff;
// Boolean-valued keys only: these are what content gates on (`needs`). workshopsBooked is a count.
export type SignoffFlag = { [K in keyof Signoff]: Signoff[K] extends boolean ? K : never }[keyof Signoff];
