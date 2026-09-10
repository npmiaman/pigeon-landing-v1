import { useState } from 'react'
import { WorkflowCard, type LiveStatus } from '@/components/app/workflow-card'
import { Section } from '@/sections/section'
import { LANES } from '@/demo/data'

/**
 * The seven lanes of the Workflow tab as the seven steps of the story, drawn
 * with the tab's own node card. Click one and the text under the row says
 * what happens in that lane.
 */

const DETAIL: Record<(typeof LANES)[number]['id'], string> = {
  intake: 'A message is routed from its text alone: a question about the work is answered, an ICP brief starts research, a product to build goes to the coding agent. If you gave it your website and documents, it has read them, for understanding only.',
  discovery: 'A value hypothesis and what would falsify it. Then candidate communities, enriched, reviewed for ICP relevance twenty at a time, opened live to prove they are alive, ranked, and cut to three with reserves. A drop needs a second, adversarial check.',
  deepDive: 'Every thread in the last thirty days, up to 1,500 per community, opened with every comment expanded. Who talks there and who wrote each thing. Then up to seventy minutes of deliberation per community. A room that turns out to be the wrong room is dropped and a reserve takes its slot.',
  idea: 'One candidate per community, ranked on the evidence it read, not on what sounded good. The winner is the strongest recurring problem a small free tool could actually answer.',
  validation: 'Before a line of code: posts and comments drafted in the voice each room trusts, every one anchored on a quote, every one waiting for your approval. Three and a half days of listening to what comes back.',
  build: 'A brief, a plan you approve, then code written and verified in a real browser, read by a fresh reviewer, and clicked through by a first-time user. Ships to your own Vercel.',
  after: 'Launch drafts for the same rooms, then seven days of listening. Replies are drafted, leads are ranked, and the report is yours.',
}

const STATUS: LiveStatus[] = ['done', 'done', 'done', 'running', 'pending', 'pending', 'pending']

export function Pipeline() {
  const [open, setOpen] = useState<(typeof LANES)[number]['id']>('deepDive')
  return (
    <Section
      id="how-it-works"
      index={1}
      total={6}
      eyebrow="how it works"
      title="One long workflow, not a chatbot with a research button."
      lede="A message arrives, communities are found, a month of them is read, an idea is chosen, validated with real people, built, shipped, and listened to. These are the seven lanes of the Workflow tab, drawn with its own cards."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
        {LANES.map((lane, index) => (
          <div key={lane.id} className="relative">
            {index < LANES.length - 1 && (
              <span className="absolute top-1/2 -right-2 hidden h-px w-2 bg-border lg:block" aria-hidden />
            )}
            <WorkflowCard
              kind="phase"
              status={STATUS[index]}
              note={`${lane.steps} steps`}
              title={lane.title}
              line={lane.blurb}
              selected={open === lane.id}
              onClick={() => setOpen(lane.id)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white/60 p-5 sm:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-charcoal/50">
          <span className="text-charcoal/35">[ </span>{LANES.find((l) => l.id === open)?.title}<span className="text-charcoal/35"> ]</span>
        </p>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-charcoal/80">{DETAIL[open]}</p>
      </div>
    </Section>
  )
}
