export const workGroups = [
{
  id: 'chief-of-staff',
  title: 'Chief of Staff',
  summary: 'The day starts handled',
  items: [
  { n: 1, title: 'Morning brief before 7am', body: 'Pulls open loops from email and tasks, and suggests what it can knock out before you start.' },
  { n: 2, title: 'Every email starts as a draft', body: 'Scans the inbox about every 2 hours and drafts replies, checking your calendar and finding the attachments and links asked for.' },
  { n: 3, title: 'One task list that talks back', body: "Todoist as the central list, where Roger logs what it's blocked on. Paste a link into chat to tell it how to solve one." }]

},
{
  id: 'meetings',
  title: 'Meetings',
  summary: 'Meetings that turn into action',
  items: [
  { n: 4, title: 'Prep briefs before you walk in', body: 'Pulled from meeting notes (Granola) and your docs (Notion).' },
  { n: 5, title: "Decisions don't rot in notes", body: 'After every meeting, decisions are folded into Notion, Linear and Todoist.' },
  { n: 6, title: 'Live capture to action', body: 'Recordings (e.g. Plaud) become notes the agents can act on.' }]

},
{
  id: 'specialists',
  title: 'Specialists',
  summary: 'A specialist for every lane',
  items: [
  { n: 7, title: 'Specialist agents', body: 'One each for curriculum, engineering, coaching, hiring, content and ops, plus one for every piece of software you use.' },
  { n: 8, title: 'Group rooms', body: '2–4 agents share one project thread, so you stop copy-pasting context between them.' },
  { n: 9, title: 'Mentor Mind', body: 'A coach that helps you hold the bar, grounded in your own standards, never invented doctrine.' }]

},
{
  id: 'offline',
  title: 'While you’re offline',
  summary: 'Work that runs while you’re offline',
  items: [
  { n: 10, title: 'Always-on routines', body: 'Monitors app errors (Sentry) and proactively fixes them.' },
  { n: 11, title: 'Coding agents that ship', body: 'Pick up Linear issues, run the open-work list by you at end of day, open PRs, then squash-merge when done.' },
  { n: 12, title: 'No collisions', body: "Engineering work is tracked in Linear, so your agents and your team's agents don't step on each other." }]

},
{
  id: 'knowledge',
  title: 'Knowledge',
  summary: 'Knowledge and output, on demand',
  items: [
  { n: 13, title: 'A living knowledge base', body: 'A shareable Notion workspace plus a GitHub repo, updated daily from what actually happened.' },
  { n: 14, title: 'Honest progress look-ups', body: 'Ask where a student, client or project stands, pulled across your systems without inventing numbers.' },
  { n: 15, title: 'Presentations without slide tools', body: 'Decks spun up in Gamma or Claude Design.' }]

}];


export const workTools =
'Gmail, Google Calendar, Notion, Linear, Todoist, Granola, GitHub, Sentry, Gamma, Plaud, and more.';