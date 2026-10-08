// Home FAQ (spec §6A.9, R7). Same shape and rendering as the work FAQ (./faqs.ts): FaqList runs each
// answer through faqAnswer, so gated items hide and empty config values drop their clause.
// R7: the three home answers are drafted conservatively and promise nothing beyond the home menu
// (spec §4.3). Peter signs them off before launch. The ownership answer is the work FAQ's; the password
// answer is the work one with a home question, under the same passwordPolicy gate. Both come from
// sharedFaq(), whose ids are a typed tuple, so a rename in faqs.ts is a compile error here. The cost
// answer is home's own: /home sells no care plan (spec §6A.7), so it stops at the provider subscription.
import { sharedFaq } from './faqs';
import type { Faq } from './faqs';

export const homeFaqs: Faq[] = [
  {
    id: 'home-allergies',
    q: 'What about allergies and picky eaters?',
    a: "I can't guarantee allergy safety. An assistant can get things wrong, so for a serious allergy, still check the labels yourself. In your session you tell me the allergies, the foods each person won't eat and the brands you buy. I set the meal plan up to take that list into account, and you approve each week's dinners before anything is ordered."
  },
  {
    id: 'home-grocery-account',
    q: 'Do I need a grocery delivery account?',
    a: "Only if you want the cart built for you. If you already order groceries online, we use that account. If you don't, you can still get the weekly plan. We'll check which stores you use at the start of your session."
  },
  {
    id: 'home-partner',
    q: 'Can my partner use it?',
    a: "We'll decide in your session what your partner sees. It runs on your own account, so you choose what's shared."
  },
  sharedFaq('own-it'),
  { ...sharedFaq('passwords'), id: 'home-passwords', q: 'What about my passwords?' },
  {
    id: 'home-cost-after',
    q: 'What does it cost after setup?',
    a: "Your assistant's own subscription, paid directly to the provider (usually {providerCostRange}/month).",
    interpolates: 'providerCostRange',
    optionalClause: ' (usually {providerCostRange}/month)'
  }
];
