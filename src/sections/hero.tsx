import { useEffect, useRef, useState } from 'react'
import { Composer } from '@/components/app/composer'
import { Pigeons } from '@/components/pigeons'
import { AquaAnchor } from '@/components/aqua-button'
import { CommunityAgents, TaskChecklist, ThinkingBlock, type ActivityStep, type CommunityProgress } from '@/components/app/activity'
import { Tag } from '@/sections/section'
import { EXAMPLE_ICP } from '@/demo/data'
import { CALENDLY } from '@/lib/links'

/**
 * The hero is the composer. A visitor types who they sell to and watches the
 * first stages of a run tick past in the same checklist the dashboard shows.
 *
 * What ticks is a PREVIEW and is labelled as one: the stages are the real
 * stage names in the real order, the communities are picked from the words
 * typed, and nothing is fetched. A real run reads about twelve hours of the
 * internet; this reads the sentence.
 */

const STAGES: { id: string; title: string; summary: string }[] = [
  { id: 'first-principles-plan', title: 'Value hypothesis', summary: 'What these people are trying to get done, and what would prove the claim wrong.' },
  { id: 'community-discovery', title: 'Community discovery', summary: 'Candidate communities from the ICP and its adjacent motions.' },
  { id: 'community-enrichment', title: 'Enrichment', summary: 'Size, posting rate and rules read for each one.' },
  { id: 'relevance-review', title: 'ICP relevance review', summary: 'Twenty at a time, every drop reason re-judged.' },
  { id: 'live-verification', title: 'Live verification', summary: 'Every survivor opened for real. Too quiet to claim recurrence gets dropped.' },
  { id: 'top-ten-selection', title: 'Three, with reserves', summary: 'Three communities selected, reserves behind them.' },
  { id: 'deep-research', title: 'Reading the month', summary: '' },
]

// Which rooms the preview names. Guessed from the words typed, and honest
// about being a guess: the label over the panel says so.
// Order matters: "founders without a marketing team" is about founders, so the
// founder line sits above the marketing one.
const ROOMS: { match: RegExp; rooms: string[] }[] = [
  { match: /founder|startup|saas|indie|bootstrap|pre-?seed/i, rooms: ['startups', 'SaaS', 'Entrepreneur'] },
  { match: /shopify|e-?commerce|store|dtc|d2c|merchant/i, rooms: ['shopify', 'ecommerce', 'FulfillmentByAmazon'] },
  { match: /seo|content|marketing|growth|agency/i, rooms: ['SEO', 'marketing', 'PPC'] },
  { match: /dentist|clinic|doctor|patient|therap/i, rooms: ['Dentistry', 'medicine', 'therapists'] },
  { match: /real ?estate|realtor|landlord|property/i, rooms: ['realtors', 'RealEstate', 'Landlord'] },
  { match: /restaurant|cafe|bar owner|chef/i, rooms: ['restaurateur', 'KitchenConfidential', 'smallbusiness'] },
  { match: /developer|engineer|devops|api|sdk|open ?source/i, rooms: ['webdev', 'devops', 'ExperiencedDevs'] },
  { match: /recruit|hiring|hr\b|people ops/i, rooms: ['recruiting', 'humanresources', 'AskHR'] },
]

function roomsFor(text: string): string[] {
  return ROOMS.find((entry) => entry.match.test(text))?.rooms ?? ['smallbusiness', 'Entrepreneur', 'startups']
}

type Run = { brief: string; rooms: string[]; tick: number }

// Ticks per stage, so discovery reads as slower than enrichment. The last
// stage never completes: the preview stops where the real work starts.
const STAGE_TICKS = [3, 4, 2, 3, 3, 2]
const TICK_MS = 700

function stepsAt(run: Run): ActivityStep[] {
  let remaining = run.tick
  return STAGES.map((stage, index) => {
    const cost = STAGE_TICKS[index]
    if (cost === undefined) {
      return remaining > 0
        ? { ...stage, status: 'running', detail: `r/${run.rooms[0]} · ${communitiesAt(run)[0]?.action ?? 'walking the listing to the 30-day cutoff'}` }
        : { ...stage, status: 'pending' }
    }
    if (remaining >= cost) {
      remaining -= cost
      return { ...stage, status: 'completed', summary: index === 5 ? `${run.rooms.map((r) => `r/${r}`).join(', ')} selected.` : stage.summary }
    }
    const step: ActivityStep = { ...stage, status: remaining > 0 || index === 0 ? 'running' : 'pending', summary: undefined, detail: stage.summary }
    remaining = 0
    return step
  })
}

function communitiesAt(run: Run): CommunityProgress[] {
  const started = run.tick - STAGE_TICKS.reduce((a, b) => a + b, 0)
  if (started <= 0) return []
  const totals = [1124, 706, 903]
  return run.rooms.map((community, index) => {
    const total = totals[index]
    const opened = Math.min(total, Math.max(0, started - index * 3) * 61)
    if (opened === 0) return { community, action: 'walking the listing to the 30-day cutoff', opened: 0 }
    if (opened >= total) return { community, action: `analyzing the evidence from all ${total.toLocaleString()} assembled threads`, opened, total, done: true }
    return { community, action: `opening thread ${opened} of ${total} and expanding every comment`, opened, total }
  })
}

export function Hero() {
  const [run, setRun] = useState<Run | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const totalTicks = STAGE_TICKS.reduce((a, b) => a + b, 0) + 24

  useEffect(() => {
    if (!run || run.tick >= totalTicks) return
    timer.current = window.setTimeout(() => setRun((r) => (r ? { ...r, tick: r.tick + 1 } : r)), TICK_MS)
    return () => window.clearTimeout(timer.current)
  }, [run, totalTicks])

  const start = (text: string) => setRun({ brief: text, rooms: roomsFor(text), tick: 1 })
  const stop = () => setRun(null)

  const steps = run ? stepsAt(run) : []
  const communities = run ? communitiesAt(run) : []
  const done = steps.filter((s) => s.status === 'completed').length

  return (
    <section className="relative">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" aria-hidden />
      <div className="rail relative mx-auto max-w-6xl px-6 pt-10 pb-14 sm:px-10 sm:pt-14 sm:pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow">for founders doing things that don't scale</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            Find the people you sell to. Read what they keep saying. Build the thing they asked for.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-charcoal/65 text-pretty sm:text-base">
            Pigeon is an AI coworker for early-stage founders. Describe your ICP and it finds where those people talk, reads a month of it, validates the strongest recurring problem with real people, and ships a free tool that answers it.
          </p>
        </div>

        {/* the composer, the way it looks in the app, and the run under it */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <Tag tone="ember">{run ? 'preview · the real run reads for about twelve hours' : 'try it · nothing is fetched'}</Tag>
            {!run && (
              <button
                type="button"
                onClick={() => start(EXAMPLE_ICP)}
                className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-charcoal/50 underline-offset-4 hover:text-ink hover:underline"
              >
                use an example
              </button>
            )}
          </div>
          <div className="rounded-[20px] border border-border bg-white/70 p-3 shadow-[0_20px_60px_-30px_rgba(22,22,26,0.25)] backdrop-blur-sm">
            {run && (
              <div className="mb-3 flex flex-col gap-3 px-1 pt-1 text-left">
                <div className="ml-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[13px] leading-[1.55] tracking-[-0.006em] whitespace-pre-wrap">
                  {run.brief}
                </div>
                <ThinkingBlock
                  live={run.tick < totalTicks}
                  heading={`Reading the brief as a motion, not a label.`}
                  body={`These people are trying to get something specific done. The rooms worth reading are where that work is discussed, which is rarely the room named after the job title.`}
                />
                <TaskChecklist steps={steps} label="Reddit research" />
                {communities.length > 0 && <CommunityAgents communities={communities} />}
                {run.tick >= totalTicks && (
                  <p className="px-1 text-[12px] leading-relaxed text-muted-foreground">
                    {done}/{STAGES.length} stages shown. From here a real run reads every thread in the window, deliberates on each community, and comes back with a report, a lead table and drafts you approve.{' '}
                    <a href={CALENDLY} target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">Talk to the founder about running one.</a>
                  </p>
                )}
              </div>
            )}
            <Composer docked busy={Boolean(run) && run!.tick < totalTicks} onSend={start} onStop={stop} />
          </div>
          {/* the ground under the card: pigeons, seeds, the width of the card
              plus a little either side so one can wander off the edge */}
          <Pigeons className="-mx-6 mt-1 sm:-mx-16" fromSelector="#nav-pigeon" />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <AquaAnchor href={CALENDLY} target="_blank" rel="noreferrer" size="lg">
            Talk to the founder
          </AquaAnchor>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] tracking-[0.08em] text-charcoal/45">
          Reddit and LinkedIn · a run takes hours and survives a restart · nothing posts without you
        </p>
      </div>
    </section>
  )
}
