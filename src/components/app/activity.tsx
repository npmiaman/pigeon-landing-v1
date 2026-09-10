import { useId, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

/**
 * The run-in-flight surfaces, ported from the dashboard's
 * `components/agent-activity.tsx` with the same markup and classes. The only
 * difference is the data: the dashboard reads persisted step records, these
 * take whatever the page hands them. Nothing here fetches.
 */

export type ActivityStep = {
  id?: string
  title?: string
  summary?: string
  status?: 'completed' | 'running' | 'failed' | 'waiting' | 'pending'
  detail?: string
}

export type CommunityProgress = {
  community: string
  action: string
  opened?: number
  total?: number
  done?: boolean
  summary?: string
}

/**
 * Circular band glyph that reads as an agent turning something over. A ring of
 * thin bars behind a circular mask; a brightness wave sweeps across them on a
 * staggered delay, so the shape reads as one object thinking.
 */
export function AgentThinking({ size = 34, className = '', paused = false }: { size?: number; className?: string; paused?: boolean }) {
  const clipId = useId()
  const bars = 15
  const span = 100 / bars
  const thickness = span * 0.62
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`shrink-0 ${className}`} role="img" aria-label="Agent thinking">
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="50" cy="50" r="50" className="fill-foreground/[0.07]" />
        {Array.from({ length: bars }, (_, index) => {
          const offset = index * span + (span - thickness) / 2
          return (
            <rect
              key={index}
              className={`fill-foreground ${paused ? 'opacity-30' : 'agent-thinking-band'}`}
              x={0}
              y={offset}
              width={100}
              height={thickness}
              style={{ animationDelay: `${index * 0.085}s` }}
            />
          )
        })}
      </g>
    </svg>
  )
}

export function ThinkingBlock({ heading, body, live = false, defaultOpen = true }: { heading: string; body: string; live?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="text-[13px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
        <span>{live ? 'Thinking…' : 'Thought process'}</span>
      </button>
      {open && (
        <div className="mt-2 border-l border-border pl-4">
          <p className="font-semibold text-foreground/90">{heading}</p>
          <p className="mt-1.5 leading-relaxed whitespace-pre-line text-muted-foreground">{body}</p>
        </div>
      )}
    </div>
  )
}

type TaskState = 'done' | 'active' | 'pending' | 'failed'

function taskState(status: string | undefined): TaskState {
  if (status === 'completed') return 'done'
  if (status === 'failed') return 'failed'
  if (status === 'running') return 'active'
  return 'pending'
}

function ListChecks() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground" aria-hidden>
      <path d="m3 7 2 2 4-4M3 17l2 2 4-4M13 7h8M13 17h8" />
    </svg>
  )
}

/** Checklist of the run's stages. */
export function TaskChecklist({ steps, label, liveDetail }: { steps: ActivityStep[]; label?: string; liveDetail?: string }) {
  const [open, setOpen] = useState(true)
  if (!steps.length) return null
  const done = steps.filter((step) => taskState(step.status) === 'done').length
  return (
    <div className="overflow-hidden rounded-xl border bg-card/60">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <ListChecks />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {label ? `${label} · ` : ''}{done}/{steps.length} done
        </span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
          aria-label={open ? 'Collapse task list' : 'Expand task list'}
        >
          {open ? <X className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>
      {open && (
        <ul className="divide-y">
          {steps.map((step, index) => {
            const state = taskState(step.status)
            return (
              <li key={step.id ?? index} className="flex items-start gap-2.5 px-3 py-2.5">
                <span className="mt-px flex size-4 shrink-0 items-center justify-center">
                  {state === 'done' ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : state === 'failed' ? (
                    <X className="size-4 text-destructive" />
                  ) : state === 'active' ? (
                    <span className="size-3.5 animate-spin rounded-full border border-dashed border-foreground/60" />
                  ) : (
                    <span className="size-3.5 rounded-full border border-muted-foreground/40" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[13px] leading-5 ${
                      state === 'done' ? 'text-muted-foreground/90' : state === 'pending' ? 'text-muted-foreground' : 'font-medium text-foreground'
                    }`}
                  >
                    {step.title ?? 'Research step'}
                  </span>
                  {state === 'active' && (step.detail ?? liveDetail) ? (
                    <span className="agent-live-line mt-0.5 block truncate text-[12px] leading-4 text-muted-foreground">
                      {step.detail ?? liveDetail}
                    </span>
                  ) : step.summary ? (
                    <span className="mt-0.5 block text-[12px] leading-[1.5] text-muted-foreground/85">{step.summary}</span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const ACTION_VERBS = ['Read', 'Edit', 'Write', 'Bash', 'Search', 'Grep', 'Glob', 'Fetch', 'Browse', 'Run', 'Test', 'Install', 'Create', 'Delete', 'Move']

function splitAction(title: string): { verb: string | null; target: string } {
  const match = /^([A-Z][a-zA-Z]*)\s+([\s\S]+)$/.exec(title.trim())
  if (!match || !ACTION_VERBS.includes(match[1])) return { verb: null, target: title.trim() }
  return { verb: match[1], target: match[2] }
}

/** What the coding agent has done, as a transcript rather than a to-do list. */
export function ActionTranscript({ steps }: { steps: ActivityStep[] }) {
  const [open, setOpen] = useState(true)
  if (!steps.length) return null
  const running = steps.filter((step) => taskState(step.status) === 'active').length
  return (
    <div className="text-[13px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
        <span>{steps.length} action{steps.length === 1 ? '' : 's'}{running ? ' · working' : ''}</span>
      </button>
      {open && (
        <ol className="mt-1.5 flex flex-col gap-1.5">
          {steps.map((step, index) => {
            const state = taskState(step.status)
            const { verb, target } = splitAction(step.title ?? '')
            return (
              <li key={step.id ?? index} className="flex items-start gap-2.5">
                <span
                  className={`mt-[6px] size-1.5 shrink-0 rounded-full ${
                    state === 'failed' ? 'bg-destructive' : state === 'active' ? 'agent-live-line bg-emerald-500' : state === 'done' ? 'bg-emerald-500/70' : 'bg-muted-foreground/40'
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className={`leading-5 ${state === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {verb && <span className="font-medium text-foreground">{verb} </span>}
                    <span className="font-mono text-[12px]">{target}</span>
                  </span>
                  {step.summary && <span className="mt-0.5 block text-[12px] leading-[1.5] text-muted-foreground/85">{step.summary}</span>}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

/** One row per community agent: what it is doing and how far it has read. */
export function CommunityAgents({ communities }: { communities: CommunityProgress[] }) {
  if (!communities.length) return null
  const read = communities.reduce((total, item) => total + (item.opened ?? 0), 0)
  const known = communities.reduce((total, item) => total + (item.total ?? 0), 0)
  const hasCompleteDenominator = communities.every((item) => item.total !== undefined || (item.opened ?? 0) === 0)
  const finished = communities.filter((item) => item.done).length
  const allDone = communities.length > 0 && finished === communities.length
  return (
    <div className="overflow-hidden rounded-xl border bg-card/60">
      <div className="flex items-center gap-2 border-b px-3 py-2 text-xs text-muted-foreground">
        <span className="flex shrink-0 items-center -space-x-1">
          <img src="/workwithpigeon_logo.png" alt="Pigeon" width={16} height={16} className="size-4 shrink-0 [image-rendering:pixelated]" />
          <img src="/reddit-logo.png" alt="Reddit" width={16} height={16} className="size-4 shrink-0 rounded-full ring-1 ring-background" />
        </span>
        <span className="font-medium">{finished}/{communities.length} communities</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">
          {read.toLocaleString()}{known && hasCompleteDenominator ? ` of ${known.toLocaleString()}` : ''} posts read
        </span>
      </div>
      <ul className="divide-y">
        {communities.map((item) => {
          const opened = item.opened ?? 0
          const pct = item.total ? Math.min(100, Math.round((opened / item.total) * 100)) : 0
          return (
            <li key={item.community} className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center">
                  {item.done ? <Check className="size-3.5 text-emerald-500" /> : <AgentThinking size={13} paused={allDone} />}
                </span>
                <span className={`shrink-0 text-[13px] font-medium ${item.done ? 'text-muted-foreground' : 'text-foreground'}`}>r/{item.community}</span>
                <span className="truncate text-[13px] text-muted-foreground">{item.action}</span>
                {item.total ? (
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{opened}/{item.total}</span>
                ) : item.opened !== undefined ? (
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{item.opened.toLocaleString()} read</span>
                ) : null}
              </div>
              {item.summary && <p className="mt-1 ml-6 text-[12px] leading-[1.5] text-muted-foreground">{item.summary}</p>}
              {item.total ? (
                <div className="mt-1.5 ml-6 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full rounded-full bg-foreground/45 transition-[width] duration-500" style={{ width: `${item.done ? 100 : pct}%` }} />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
