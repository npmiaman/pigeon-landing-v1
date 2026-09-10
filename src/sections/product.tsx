import { useState } from 'react'
import { AppFrame, type AppView } from '@/components/app/frame'
import { ActionTranscript, CommunityAgents, TaskChecklist, ThinkingBlock } from '@/components/app/activity'
import { EngagementPanel } from '@/components/app/engagement'
import { CommunityCard } from '@/components/app/report'
import { LeadsTable } from '@/components/app/leads'
import { ApprovalPanel } from '@/components/app/approval'
import { Composer } from '@/components/app/composer'
import { Section, Tag } from '@/sections/section'
import { BUILD_ACTIONS, BUILD_QUESTION, DRAFTS, EXAMPLE_ICP, LEADS, REPORT_COMMUNITY, RESEARCH_COMMUNITIES, RESEARCH_STAGES } from '@/demo/data'

/**
 * The product, in its own window. Each tab is one of the dashboard's real
 * surfaces, rendered from the same components with example data, so what a
 * visitor sees here is what a founder sees there.
 */

type Feature = {
  id: 'research' | 'report' | 'drafts' | 'leads' | 'build'
  view: AppView
  label: string
  title: string
  body: string
  tag: string
}

const FEATURES: Feature[] = [
  {
    id: 'research',
    view: 'chat',
    label: 'Research',
    title: 'Watch it read',
    body: 'Every stage as a checklist that only shows what the run actually reached, and one row per community agent saying what it is doing this minute. A slow step and a stuck step look different.',
    tag: 'example run',
  },
  {
    id: 'report',
    view: 'report',
    label: 'Report',
    title: 'The voice each room trusts',
    body: 'Per community: the archetype that gets upvoted, what to avoid, what people there keep struggling with, the top voices, and who is actually in the room versus passing through.',
    tag: 'example data',
  },
  {
    id: 'drafts',
    view: 'chat',
    label: 'Drafts',
    title: 'Nothing posts itself',
    body: 'Validation posts, comments, replies and launch posts arrive as drafts with the quote each one anchors on. You approve, copy, or skip. The first post here is a real draft the system wrote, unedited.',
    tag: 'real draft · example comment',
  },
  {
    id: 'leads',
    view: 'leads',
    label: 'Leads',
    title: 'Everyone it met, ranked by fit',
    body: 'Every person a run read, judged against your ICP with what they struggled with and where, in their own words, each claim linked to the thread. The table builds itself when a run finishes. A person read once is never read twice.',
    tag: 'example data',
  },
  {
    id: 'build',
    view: 'chat',
    label: 'Build',
    title: 'Approve, then it ships',
    body: 'The plan stops for you. After you approve, the coding agent writes the tool, tests it in a real browser, has a fresh reviewer read it, and a first-time user click through it. Then it ships to your Vercel.',
    tag: 'example build',
  },
]

function ResearchPane() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 px-5 pt-5 pb-4">
        <div className="ml-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[13px] leading-[1.55] tracking-[-0.006em] whitespace-pre-wrap">{EXAMPLE_ICP}</div>
        <ThinkingBlock
          live
          heading="Reading the brief as a motion, not a label."
          body="Founders at this stage are trying to get strangers to answer. The rooms worth reading are where that loop is discussed, which is rarely a room named after the job title."
        />
        <TaskChecklist steps={RESEARCH_STAGES} label="Reddit research" />
        <CommunityAgents communities={RESEARCH_COMMUNITIES} />
      </div>
      <div className="px-5 pb-4">
        <Composer docked busy />
      </div>
    </div>
  )
}

function ReportPane() {
  return (
    <div className="space-y-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em]">Communities</h2>
          <span className="font-mono text-[12px] text-muted-foreground/80">3 read · 2 in reserve</span>
        </div>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">Each card is a room the run read in full. The voice, the problems and the people are learned from what was upvoted there, not from what the founder hoped.</p>
      </div>
      <CommunityCard c={REPORT_COMMUNITY} />
    </div>
  )
}

function DraftsPane() {
  const [items, setItems] = useState(DRAFTS)
  return (
    <div className="space-y-3 p-5">
      <div className="ml-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[13px] leading-[1.55] tracking-[-0.006em]">go</div>
      <div className="text-[14px] leading-[1.6] text-foreground/90">
        The campaign is armed on r/startups, r/SaaS and r/Entrepreneur. Two drafts are waiting. Approve queues a post from the account this client connected; nothing goes out on its own.
      </div>
      <EngagementPanel
        items={items}
        postsAs="your_account"
        onAction={(id, action) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'skipped' } : item))}
      />
    </div>
  )
}

function LeadsPane() {
  return (
    <div className="space-y-3 p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em]">Leads</h2>
        <span className="font-mono text-[12px] text-muted-foreground/80">4 of 212 people · ours 2 · adjacent 1</span>
      </div>
      <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">Everyone the folder's crawls met, ours first, built the moment a run finishes. Your company profile is shown as background for the match, never as the thing that decides it. "Draft a reply" writes an approval-gated draft into the room's engagement queue, like every other public word.</p>
      <LeadsTable leads={LEADS} />
    </div>
  )
}

function BuildPane() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 px-5 pt-5 pb-4">
        <div className="ml-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[13px] leading-[1.55] tracking-[-0.006em]">build it</div>
        <div className="overflow-hidden rounded-xl border bg-card/60">
          <div className="px-3 py-2.5 text-[13px] leading-relaxed text-foreground/90">
            The validation window closed with 14 replies across three rooms, 9 of them describing the same loop unprompted. Strong enough to build.
          </div>
          <ApprovalPanel question={BUILD_QUESTION} />
        </div>
        <ActionTranscript steps={BUILD_ACTIONS} />
      </div>
      <div className="px-5 pb-4">
        <Composer docked />
      </div>
    </div>
  )
}

export function Product() {
  const [active, setActive] = useState<Feature['id']>('research')
  const feature = FEATURES.find((f) => f.id === active)!

  return (
    <Section
      id="product"
      index={2}
      total={6}
      eyebrow="the product"
      title="This is the app. Not a picture of it."
      lede="Every panel below is rendered from the dashboard's own components, in its shipped dark theme, with example data where a real run would have read real people."
    >
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        <div className="flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start">
          {FEATURES.map((f, index) => {
            const on = f.id === active
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${on ? 'border-ink/20 bg-white shadow-sm' : 'border-transparent hover:bg-white/60'}`}
                aria-pressed={on}
              >
                <span className="flex items-center gap-3">
                  <span className={`font-mono text-[11px] tabular-nums ${on ? 'text-ember' : 'text-charcoal/40'}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={`text-[14px] font-medium ${on ? 'text-ink' : 'text-charcoal/70'}`}>{f.label}</span>
                </span>
                {on && (
                  <span className="mt-2 block">
                    <span className="block font-display text-[17px] font-semibold tracking-tight">{f.title}</span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-charcoal/65">{f.body}</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <Tag>{feature.tag}</Tag>
            <Tag>dark · the shipped default</Tag>
          </div>
          <AppFrame view={feature.view} onView={(view) => {
            const target = FEATURES.find((f) => f.view === view && (view !== 'chat' || f.id === 'research'))
            if (target) setActive(target.id)
          }} clientName="Pigeon" sessions={['first-100-users', 'cold-outreach']}>
            {active === 'research' && <ResearchPane />}
            {active === 'report' && <ReportPane />}
            {active === 'drafts' && <DraftsPane />}
            {active === 'leads' && <LeadsPane />}
            {active === 'build' && <BuildPane />}
          </AppFrame>
        </div>
      </div>
    </Section>
  )
}
