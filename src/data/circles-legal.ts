import type { LegalDoc } from "./legal";
import { siteConfig } from "./config";

// Draft marketing terms from Circles spec 6.8. Review before opening intake.
export const circlesTerms: LegalDoc = {
  title: "Circles terms",
  updated: "November 2026 (draft)",
  intro:
    "These are draft terms for Roger Circles. Applications, payments and weekly delivery are not enabled on this preview. Peter must review these terms before launch.",
  sections: [
    {
      heading: "What a Circle includes",
      body: [
        "A confidential group of eight people using AI agents for work. The planned membership includes a ranked list of plays each Monday, a personal top 3, install help, and two optional one-hour working sessions a week.",
      ],
    },
    {
      heading: "Price and billing",
      body: [
        "Membership is US$200 or CA$280 per month, in the currency you choose. Nothing is charged to apply. Each Circle starts when its eight seats are filled, and billing begins at kickoff. You can leave any time.",
      ],
    },
    {
      id: "circles-guarantee",
      heading: "The 45-day money-back guarantee",
      body: [
        "If you ask within 45 days of your Circle's kickoff date, we refund every membership payment you have made. Because billing is monthly, this can include both the first and second charges.",
        `Send one email to ${siteConfig.contactEmail}. No form or call is required.`,
        "Refunds go to the original payment method, in the currency paid, within 10 business days. After a refund your membership ends and the seat goes to the waiting list.",
      ],
    },
    {
      heading: "The Circle's rules",
      body: [
        "Contribute: send your Zack run by Sunday night. No run means no list on Monday. After three missed weeks in a row, your seat goes to the waiting list.",
        "Confidential: nothing shared in the Circle leaves it. Members sign a separate confidentiality agreement before joining. Cora, an AI agent run by Roger, processes members' weekly runs to merge and rank their plays.",
        "Candid: share what failed as well as what worked. A Circle is for trading what works, not selling to other members.",
      ],
    },
    {
      heading: "Before launch",
      body: [
        "The confidentiality agreement, report-retention policy and final privacy wording still need Peter's review. The automatic weekly workflow is a separate build and is not running on this preview.",
      ],
    },
  ],
};

export const circlesPrivacyPreview: LegalDoc = {
  title: "Circles privacy preview",
  updated: "November 2026 (draft)",
  intro:
    "This describes the marketing preview only. The full Circles privacy notice must be completed and reviewed before applications or report uploads open.",
  sections: [
    {
      heading: "Running Zack",
      body: [
        "You can download or copy a Zack file here. Zack runs inside your own agent account. This site does not connect to that account or see your activity. This preview does not collect your email or accept reports.",
      ],
    },
    {
      heading: "Your currency choice",
      body: [
        "We use the country supplied with your web request to show Canadian dollars first for visitors in Canada and US dollars for everyone else. Your currency choice is stored in your browser tab. We do not store your country.",
      ],
    },
    {
      heading: "The public library",
      body: [
        "The library summarises public posts in Roger's own words and links to the original. It shows the author's public handle. Email us if you want a post of yours removed.",
      ],
    },
    {
      heading: "Existing library sign-ups",
      body: [
        "The library's optional watch sign-up is separate from Circles. It collects the email and search you provide so Roger can send matching use cases. Each watch email includes a way to stop. The site runs on Vercel, its database is hosted by Neon, and email is sent through Resend. These services may store information outside Canada.",
      ],
    },
    {
      heading: "What still needs review",
      body: [
        "Application and report intake are not enabled. The launch policy will need to cover application data, deletion, the report-retention period and the services processing it. Member runs will be processed by Cora, an AI agent. Provider terms must be checked before any claim about model training is made.",
      ],
    },
    {
      heading: "Questions and deletion",
      body: [
        `Email ${siteConfig.contactEmail} to ask what Roger holds about you or request correction or deletion.`,
      ],
    },
  ],
};
