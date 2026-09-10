import type { ActivityStep, CommunityProgress } from '@/components/app/activity'
import type { EngagementItem } from '@/components/app/engagement'
import type { ReportCommunity } from '@/components/app/report'
import type { Lead } from '@/components/app/leads'
import type { ApprovalQuestion } from '@/components/app/approval'

/**
 * What the product frames on the website show.
 *
 * Two kinds of content live here and they are labelled apart on the page:
 *
 * - NUMBERS are read out of the code, and each one names the constant it
 *   came from, the way docs/pigeon-workflow.md does. If a constant changes,
 *   change it here in the same commit.
 * - EXAMPLES are illustrative. Real runs read real people, and putting their
 *   words on a marketing page is not something the founder has agreed to, so
 *   the report card, the lead rows and the community rows are written to look
 *   like a run against Pigeon's own ICP (early-stage founders) without being
 *   one. The one exception is marked: the validation post under "Drafts" is a
 *   real draft the system wrote (apps/dashboard/scripts/try-draft.mts).
 */

export const NUMBERS = [
  { value: '1,500', label: 'threads read per community, at most', source: 'lib/deep-subreddit-research.ts — MAX_THREADS_PER_COMMUNITY' },
  { value: '30', label: 'days of each community, every thread in the window', source: 'lib/deep-subreddit-research.ts — the in-window walk' },
  { value: '3', label: 'communities per run, with reserves behind them', source: 'lib/research-policy.ts — communitiesWanted' },
  { value: '70', label: 'minutes of deliberation per community, at most', source: 'lib/deliberation.ts — PIGEON_DELIBERATION_MINUTES' },
  { value: '3.5', label: 'days of listening before anything is built', source: 'lib/validation-campaign.ts — DEFAULT_WINDOW_DAYS' },
  { value: '7', label: 'days of listening after it ships', source: 'lib/validation-campaign.ts — MARKETING_WINDOW_DAYS' },
  { value: '12', label: 'stages, each versioned so a fix reaches old runs', source: 'lib/stage-versions.ts — STAGES' },
  { value: '78', label: 'steps and gates on the Workflow tab, in 7 lanes', source: 'lib/workflow-map.ts — NODES, LANES' },
  { value: '3', label: 'LinkedIn comments a day, at most, from a client\'s own account', source: 'lib/linkedin-pacing.ts — DEFAULT_POLICY.dailyCaps.comment' },
  { value: '14', label: 'days before the same person is engaged again on LinkedIn', source: 'lib/linkedin-pacing.ts — DEFAULT_POLICY.authorCooldownDays' },
] as const

/** The seven lanes of the Workflow tab, titles and blurbs verbatim. */
export const LANES = [
  { id: 'intake', title: 'A message arrives', blurb: 'Routing, decided from the text alone', kind: 'entry', steps: 8 },
  { id: 'discovery', title: 'Finding the rooms', blurb: 'ICP to three communities, with reserves behind them', kind: 'step', steps: 15 },
  { id: 'deepDive', title: 'Reading the month', blurb: 'Every in-window thread, then thinking about it', kind: 'step', steps: 21 },
  { id: 'idea', title: 'Choosing what to build', blurb: 'One candidate per community, ranked on evidence', kind: 'step', steps: 8 },
  { id: 'validation', title: 'Three and a half days of listening', blurb: 'The idea meets the community before anything is built', kind: 'gate', steps: 8 },
  { id: 'build', title: 'Building it', blurb: 'Brief to shippable tool, through gates that run every time', kind: 'step', steps: 14 },
  { id: 'after', title: 'After it ships', blurb: 'Publish, launch, and what comes back', kind: 'end', steps: 4 },
] as const

/** The rules that hold everywhere, from docs/pigeon-workflow.md. */
export const RULES = [
  { title: 'Nothing posts itself.', body: 'Every public word is a draft until you approve it.' },
  { title: '"Could not look" is never "nothing there."', body: 'A failed fetch, a rate limit or a silent model is recorded as itself, never as an observation about the market.' },
  { title: 'Empty is not a finding.', body: 'An empty model reply is a failure to be retried, not a verdict.' },
  { title: 'Judgements are derived, not guessed.', body: 'The consequential ones run on the strong model and write their reasoning before their verdict.' },
  { title: 'Nothing irreversible on one opinion.', body: 'Discarding a community needs a second, adversarial check. A uniform "no" is re-judged rather than believed.' },
  { title: 'Author identity is a weight, never a veto.', body: 'It is inferred from writing, and real people do not announce their job title.' },
  { title: 'Memory is permanent.', body: 'What a run read stays read. Deleting a chat never deletes what it learned.' },
  { title: 'Every cap is reported.', body: 'A stage that looked at 80 of 160 says so.' },
  { title: 'Approval gates are structural.', body: 'They are required nodes in the Workflow tab, re-imposed on every save. The editor cannot delete or disable them.' },
  { title: 'A write leaves under one identity only.', body: 'The account your client connected. The executor asks who is signed in immediately before the write and refuses on any mismatch.' },
] as const

export const FAQ = [
  {
    q: 'What do I actually give it?',
    a: 'Who you sell to, in a sentence or a paragraph. Optionally your website and any documents, which it reads for understanding, never for promotion. Nothing it writes in public pitches you.',
  },
  {
    q: 'Where does it look?',
    a: 'Reddit and LinkedIn. On Reddit it finds the communities where your ICP actually talks, verifies each one is live and is the right room, and picks three with reserves behind them. On LinkedIn it finds the cohorts your ICP comments in by who comments on what, reads the threads, and replies on a deliberately slow cadence, with a fortnight before it engages the same person again. Your client connects their own LinkedIn; Pigeon never holds a password.',
  },
  {
    q: 'How long does a run take?',
    a: 'About twelve hours for the research, then three and a half days of listening before anything is built, then seven days of listening after it ships. Everything is checkpointed in SQLite, so a restart resumes instead of starting over.',
  },
  {
    q: 'Does it post on my behalf?',
    a: 'Never on its own. Every comment, post and reply is a draft with the quote it anchors on. You approve, copy, or skip. That rule is enforced in the structure of the workflow, not a setting you can miss.',
  },
  {
    q: 'What does it build?',
    a: 'A small free tool aimed at the strongest recurring problem it found. It plans, writes the code, verifies it in a real browser, has a fresh reviewer read it, and ships it to your own Vercel.',
  },
  {
    q: 'What do I get at the end?',
    a: 'A report per community with the voice the room trusts and what people there struggle with, a lead table of everyone it met ranked by fit, the tool, and the drafts.',
  },
] as const

// ---------------------------------------------------------------- examples

export const EXAMPLE_ICP = 'Early-stage founders, pre-seed to seed, who are trying to find their first hundred users without a marketing team.'

export const RESEARCH_STAGES: ActivityStep[] = [
  { id: 'first-principles-plan', title: 'Value hypothesis', status: 'completed', summary: 'Founders at this stage spend their week on outreach that does not answer. The claim to test: the loop, not the pitch, is the problem.' },
  { id: 'community-discovery', title: 'Community discovery', status: 'completed', summary: '38 candidate communities from the ICP and its adjacent motions.' },
  { id: 'community-enrichment', title: 'Enrichment', status: 'completed', summary: 'Size, posting rate and rules read for each.' },
  { id: 'relevance-review', title: 'ICP relevance review', status: 'completed', summary: 'Twenty at a time. 11 kept, each with a reason and the drop reasons re-judged.' },
  { id: 'live-verification', title: 'Live verification', status: 'completed', summary: 'Every survivor opened for real. 2 dropped as too quiet to claim recurrence.' },
  { id: 'top-ten-selection', title: 'Three, with reserves', status: 'completed', summary: 'r/startups, r/SaaS, r/Entrepreneur selected. Reserves: r/indiehackers, r/smallbusiness.' },
  { id: 'deep-research', title: 'Reading the month', status: 'running', detail: 'r/SaaS · opening thread 412 of 706 and expanding every comment' },
  { id: 'idea-loop', title: 'Choosing what to build', status: 'pending' },
  { id: 'validation-drafting', title: 'Validation drafts', status: 'pending' },
]

export const RESEARCH_COMMUNITIES: CommunityProgress[] = [
  { community: 'startups', action: 'analyzing the evidence from all 1,124 assembled threads', opened: 1124, total: 1124, done: true, summary: 'Recurring: follow-up fatigue, "is it me or the market", pricing before proof.' },
  { community: 'SaaS', action: 'opening thread 412 of 706 and expanding every comment', opened: 412, total: 706 },
  { community: 'Entrepreneur', action: 'walking the listing to the 30-day cutoff', opened: 0 },
]

/**
 * A real draft: written by the system for r/startups against Pigeon's own
 * profile, printed by `npm run try:draft`, unedited. The second item is an
 * illustrative comment.
 */
export const DRAFTS: EngagementItem[] = [
  {
    id: 1,
    purpose: 'validation',
    title: 'how much of your week is just follow up messages',
    body: "honestly trying to figure out if i'm just bad at this or if everyone at an early stage does this\n\ni run a small thing and most weeks i'm spending a stupid amount of time on the same loop. find someone who might actually care about what we're doing, write something that doesn't sound like a template, send it, get no reply, follow up a few days later, follow up again, eventually move on. then repeat",
    status: 'draft',
  },
  {
    id: 2,
    purpose: 'karma',
    targetUrl: 'https://www.reddit.com/r/startups/',
    targetTitle: 'Cold outreach is dead for early stage. What actually works?',
    body: "it's not dead, it's just that the first 20 messages are you learning what to say and the next 20 are you learning who to say it to. most people quit inside the first batch and call it dead\n\nwhat changed things for us was stopping the pitch entirely and asking one specific question about the thing they'd just posted about",
    quote: 'sent 60 messages last month and got two replies, both no',
    status: 'draft',
  },
]

export const REPORT_COMMUNITY: ReportCommunity = {
  name: 'startups',
  fitScore: 87,
  belongs: true,
  threadsRead: 1124,
  persona: {
    archetype: 'The operator who has already shipped one thing',
    archetypeRationale: 'Upvoted replies come from people who describe what they did last quarter, in numbers, before saying what anyone else should do.',
    traits: ['specific', 'numbers first', 'unbothered by downvotes', 'answers the question asked'],
    trustSignals: ['names a real customer count or revenue, even when small', 'admits what did not work before the advice', 'links to nothing'],
    avoid: ['"excited to share"', 'any link in the first comment', 'advice with no experience attached'],
    problems: ['Outreach that goes unanswered for weeks, then the founder blames themselves', 'Choosing between building more and talking to more people', 'Pricing before anyone has paid anything'],
    learnedFromUpvotedWriting: 23,
  },
  contributors: [
    { username: 'example_operator', threads: 41, commentsWritten: 96 },
    { username: 'example_bootstrapper', threads: 27, commentsWritten: 58 },
    { username: 'example_pm_turned_founder', threads: 19, commentsWritten: 44 },
  ],
  audience: {
    digest: 'Mostly founders in their first two years, a quarter of them pre-revenue. Agencies and tool vendors visit but do not stay.',
    targetResidents: ['pre-seed founders', 'solo technical founders', 'first-time B2B founders'],
    bystanders: ['agencies', 'course sellers', 'recruiters'],
  },
}

export const LEADS: Lead[] = [
  { username: 'example_founder_a', fit: 'ours', role: 'Solo founder, B2B', struggle: 'Sent 60 cold messages in a month, two replies. Asking whether to keep going or build more.', signals: 'now · 3 asks', where: 'r/startups', status: 'drafted' },
  { username: 'example_founder_b', fit: 'ours', role: 'Two-person team', struggle: 'Cannot tell whether silence means the market or the message.', signals: 'soon · 2 asks', where: 'r/SaaS', status: 'new' },
  { username: 'example_pm', fit: 'adjacent', role: 'PM, thinking of leaving', struggle: 'Wants to validate an idea before quitting. Has never posted about it.', signals: 'someday · 1 ask', where: 'r/Entrepreneur', status: 'new' },
  { username: 'example_agency', fit: 'vendor', role: 'Runs an outreach agency', struggle: '—', signals: '—', where: 'r/startups', status: 'new' },
]

export const BUILD_QUESTION: ApprovalQuestion = {
  title: 'Ready to build. Approve the plan?',
  summary: 'One small free tool: paste a follow-up thread and it says, from the timing and the wording, whether to send one more or stop. Ships to your Vercel as a single page.',
  options: [
    { id: 'follow-up', label: 'Follow-up or stop', detail: 'Strongest recurring problem across all three communities. 71 threads anchor it.', recommended: true },
    { id: 'pricing', label: 'Price before proof', detail: 'Second by evidence. 44 threads, mostly r/SaaS.' },
  ],
}

export const BUILD_ACTIONS: ActivityStep[] = [
  { id: 'a1', title: 'Read brief.md', status: 'completed' },
  { id: 'a2', title: 'Write app/page.tsx', status: 'completed', summary: 'Single page, paste box, verdict with the reasoning under it.' },
  { id: 'a3', title: 'Test e2e/verdict.spec.ts', status: 'completed', summary: '6 passed in a real browser.' },
  { id: 'a4', title: 'Run fresh-context review', status: 'completed', summary: 'Two findings, both fixed: empty paste, and the verdict read as advice.' },
  { id: 'a5', title: 'Browse QA walkthrough as a first-time user', status: 'running', detail: 'clicking through the tool the way someone from r/startups would' },
]
