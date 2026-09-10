/**
 * One node of the Workflow tab, ported from the dashboard's
 * `components/workflow-view.tsx` (`Card`): a status dot, the kind in small
 * caps, the title, and one line on what the step does. The tab draws 67 of
 * these across 7 lanes; the website draws the seven lanes.
 */

export type LiveStatus = 'pending' | 'running' | 'waiting' | 'done' | 'failed'

const STATUS_COLOR: Record<LiveStatus, string> = {
  pending: '#6b6f76',
  running: '#f2c94c',
  waiting: '#f2c94c',
  done: '#4ea7fc',
  failed: '#eb5757',
}

export function WorkflowCard({
  kind, status, note, title, line, selected, onClick,
}: {
  kind: string
  status: LiveStatus
  note?: string
  title: string
  line: string
  selected?: boolean
  onClick?: () => void
}) {
  const working = status === 'running' || status === 'waiting'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 rounded-xl border bg-card px-3 py-2.5 text-left shadow-sm transition-shadow ${
        selected ? 'border-foreground/40 shadow-md' : 'hover:shadow-md'
      }`}
    >
      <div className="flex w-full items-center gap-1.5">
        <span className={`size-1.5 shrink-0 rounded-full ${working ? 'animate-pulse' : ''}`} style={{ background: STATUS_COLOR[status] }} />
        <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{kind}</span>
        {note && <span className="ml-auto truncate text-[10px] text-muted-foreground">{note}</span>}
      </div>
      <p className="line-clamp-2 text-[13px] leading-snug font-medium">{title}</p>
      <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{line}</p>
    </button>
  )
}
