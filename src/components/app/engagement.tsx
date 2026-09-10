import { Check, Copy, ExternalLink, Quote, SkipForward } from 'lucide-react'

/**
 * The engagement drafts panel, ported from the dashboard's
 * `components/engagement-panel.tsx`: what the campaign wants to say in a
 * community, waiting for the founder. Nothing here posts without a click and
 * every draft shows the quoted evidence it anchors on.
 */

export type EngagementItem = {
  id: number
  purpose: 'validation' | 'karma' | 'marketing' | 'feedback_reply' | 'outreach'
  targetUrl?: string | null
  targetTitle?: string | null
  title?: string | null
  body: string
  quote?: string
  status: 'draft' | 'approved' | 'posted' | 'skipped'
  postedUrl?: string | null
  replyCount?: number
}

const PURPOSE_LABEL: Record<EngagementItem['purpose'], string> = {
  validation: 'Validation posts',
  karma: 'Comments on community threads',
  marketing: 'Launch posts',
  feedback_reply: 'Replies to feedback',
  outreach: 'Replies to leads',
}

const STATUS_LABEL: Record<EngagementItem['status'], { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
  approved: { label: 'Approved — waiting for OpenCLI', className: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
  posted: { label: 'Posted', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' },
  skipped: { label: 'Skipped', className: 'bg-muted text-muted-foreground' },
}

export function EngagementPanel({ items, postsAs, onAction }: {
  items: EngagementItem[]
  postsAs?: string
  onAction?: (id: number, action: 'approve' | 'skip') => void
}) {
  const active = items.filter((item) => item.status !== 'skipped')
  const groups = new Map<EngagementItem['purpose'], EngagementItem[]>()
  for (const item of active) groups.set(item.purpose, [...(groups.get(item.purpose) ?? []), item])

  return (
    <div className="overflow-hidden rounded-xl border bg-card/60">
      <div className="border-b px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Engagement drafts</span>
        {' '}- nothing posts without your approval. Approve queues an OpenCLI write on the VM; Copy and Mark posted still work by hand.
        {postsAs && <span className="ml-1 text-foreground/80">Posts as <span className="font-medium">u/{postsAs}</span>.</span>}
      </div>
      <ul className="divide-y">
        {[...groups.entries()].map(([purpose, groupItems]) => (
          <li key={purpose} className="px-3 py-2">
            <p className="text-[12px] font-medium text-muted-foreground">{PURPOSE_LABEL[purpose]}</p>
            <ul className="mt-1.5 space-y-2">
              {groupItems.map((item) => {
                const status = STATUS_LABEL[item.status]
                const actionable = item.status === 'draft' || item.status === 'approved'
                return (
                  <li key={item.id} className="rounded-lg border bg-background/60 p-2.5">
                    <div className="flex items-center gap-2">
                      {item.targetUrl ? (
                        <a href={item.targetUrl} target="_blank" rel="noreferrer" className="min-w-0 truncate text-[12px] font-medium hover:underline">
                          {item.targetTitle ?? item.targetUrl}
                        </a>
                      ) : (
                        <span className="min-w-0 truncate text-[12px] font-medium">{item.title ?? 'New post'}</span>
                      )}
                      <span className={`ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-[12px] leading-relaxed text-foreground/90">{item.body}</p>
                    {item.quote && (
                      <p className="mt-1.5 flex items-start gap-1 text-[11px] text-muted-foreground">
                        <Quote className="mt-px size-3 shrink-0" strokeWidth={1.8} />
                        <span>anchored on: &ldquo;{item.quote}&rdquo;</span>
                      </p>
                    )}
                    {item.postedUrl && (
                      <a href={item.postedUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                        <ExternalLink className="size-3" /> posted{item.replyCount ? ` - ${item.replyCount} repl${item.replyCount === 1 ? 'y' : 'ies'}` : ''}
                      </a>
                    )}
                    {actionable && (
                      <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[12px]">
                        {item.status === 'draft' && (
                          <button type="button" onClick={() => onAction?.(item.id, 'approve')} className="inline-flex items-center gap-1 font-medium hover:opacity-75">
                            <Check className="size-3.5" strokeWidth={2} /> Approve
                          </button>
                        )}
                        <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                          <Copy className="size-3.5" strokeWidth={1.8} /> Copy
                        </button>
                        <button type="button" className="text-muted-foreground hover:text-foreground">Mark posted</button>
                        <button type="button" onClick={() => onAction?.(item.id, 'skip')} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                          <SkipForward className="size-3.5" strokeWidth={1.8} /> Skip
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
