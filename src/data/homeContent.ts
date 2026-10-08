// The weekly meal plan, `/home`'s featured example (spec §6A.5), and the sample dinners on the home phone
// mockup (spec §6A.1). Illustrations, not a client's results. Copy says "I set you up" / "your
// assistant", never "Roger does X" (spec §1, decision 1).
export const homeSteps = [
  {
    when: 'Sunday morning',
    title: '15 ideas',
    body: "Your assistant suggests 15 dinners, built around your family's tastes, this week's sales and what's already in the pantry."
  },
  {
    when: 'About 5 minutes',
    title: 'You pick 5–7',
    body: 'Easy meals land on your busiest nights. Soccer practice means a 20-minute dinner.'
  },
  {
    when: 'Sunday afternoon',
    title: 'The cart is built',
    body: "Your assistant builds the online order with the brands and sizes you buy, checks the pantry staples and adds the kids' usual snacks."
  },
  {
    when: 'Before Monday',
    title: 'Recipes arrive',
    body: "A clean PDF of the week's recipes in your inbox. Glance at the cart, pick a pickup window, done."
  }
];

export const sampleMeals = [
  { day: 'Mon', name: 'Sheet-pan lemon chicken', minutes: 35 },
  { day: 'Tue', name: 'Turkey tacos, soccer night', minutes: 20 },
  { day: 'Wed', name: 'Miso salmon rice bowls', minutes: 25 }
];
