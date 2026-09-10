import { useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * One community's card from the report, ported from the dashboard's
 * `components/report-view.tsx`: the voice the room trusts, what the people in
 * it struggle with, who the top voices are, who is actually in the room.
 */

export function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'good' | 'warn' | 'muted' }) {
  const cls = tone === 'good'
    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20'
    : tone === 'warn'
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20'
      : tone === 'muted'
        ? 'bg-muted text-muted-foreground border-transparent'
        : 'bg-secondary text-foreground border-border'
  return <span className={`inline-block rounded-md border px-1.5 py-0.5 text-[12px] ${cls}`}>{children}</span>
}

export type ReportCommunity = {
  name: string
  fitScore?: number
  belongs?: boolean
  threadsRead: number
  persona?: {
    archetype: string
    archetypeRationale?: string
    traits: string[]
    trustSignals: string[]
    avoid: string[]
    problems: string[]
    learnedFromUpvotedWriting: number
  }
  contributors: { username: string; threads: number; commentsWritten: number }[]
  audience?: { digest?: string; targetResidents: string[]; bystanders: string[] }
}

function Dot({ tone }: { tone: 'good' | 'bad' | 'plain' }) {
  const color = tone === 'good' ? 'bg-emerald-500/70' : tone === 'bad' ? 'bg-red-500/70' : 'bg-foreground/40'
  return <span className={`absolute left-0 top-[0.6em] size-[5px] rounded-full ${color}`} />
}

export function CommunityCard({ c }: { c: ReportCommunity }) {
  const [open, setOpen] = useState(false)
  const p = c.persona
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b bg-muted/30 px-4 py-3">
        <span className="font-mono text-[15px] font-semibold tracking-[-0.02em]">r/{c.name}</span>
        <span className="flex-1" />
        {typeof c.fitScore === 'number' && <Chip>fit {c.fitScore}</Chip>}
        {c.belongs === true && <Chip tone="good">ICP home</Chip>}
        <Chip tone="muted">{c.threadsRead.toLocaleString()} threads read</Chip>
      </div>

      <div className="grid gap-6 p-4 md:grid-cols-2">
        <div className="space-y-5">
          {p && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">The voice this room trusts</h4>
              <p className="text-[14px] font-medium leading-snug">{p.archetype}</p>
              {p.archetypeRationale && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.archetypeRationale}</p>}
              {p.traits.length > 0 && <div className="mt-2.5 flex flex-wrap gap-1.5">{p.traits.map((t) => <Chip key={t}>{t}</Chip>)}</div>}
              {p.trustSignals.length > 0 && (
                <ul className="mt-3 space-y-1 text-[13px] text-foreground/90">
                  {p.trustSignals.map((t) => <li key={t} className="relative pl-4"><Dot tone="good" />{t}</li>)}
                </ul>
              )}
              {p.avoid.length > 0 && (
                <ul className="mt-2 space-y-1 text-[13px] text-foreground/80">
                  {p.avoid.map((t) => <li key={t} className="relative pl-4"><Dot tone="bad" />Avoid: {t}</li>)}
                </ul>
              )}
              {p.learnedFromUpvotedWriting > 0 && (
                <p className="mt-3 text-[12px] text-muted-foreground">
                  Learned from <span className="font-medium text-foreground tabular-nums">{p.learnedFromUpvotedWriting}</span> upvoted regulars.
                </p>
              )}
            </div>
          )}

          {p && p.problems.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">What they struggle with</h4>
              <ul className="space-y-1 text-[13px] text-foreground/90">
                {p.problems.map((t) => <li key={t} className="relative pl-4"><Dot tone="plain" />{t}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {c.contributors.length > 0 && (
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Top voices</h4>
              <div className="space-y-1.5">
                {c.contributors.map((v) => (
                  <div key={v.username} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-[13px]">
                    <span className="truncate font-mono text-[12px]">u/{v.username}</span>
                    <span className="flex-1" />
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{v.threads} threads · {v.commentsWritten} comments</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground underline-offset-2">evidence ↗</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.audience && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Who is in the room</h4>
              {c.audience.digest && <p className="mb-2 text-[13px] leading-relaxed text-muted-foreground">{c.audience.digest}</p>}
              {c.audience.targetResidents.length > 0 && (
                <div className="flex flex-wrap gap-1.5">{c.audience.targetResidents.map((r) => <Chip key={r} tone="good">{r}</Chip>)}</div>
              )}
              {c.audience.bystanders.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">{c.audience.bystanders.map((b) => <Chip key={b} tone="muted">{b}</Chip>)}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground hover:bg-muted/40"
        >
          <ChevronRight className={`size-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
          Full community report
        </button>
        {open && (
          <div className="border-t px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
            The full section is the run's own writing, every claim linked to the thread it came from. It is a few thousand words per community, so the website stops here.
          </div>
        )}
      </div>
    </div>
  )
}
