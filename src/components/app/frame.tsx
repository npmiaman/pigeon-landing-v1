import type { ReactNode } from 'react'
import {
  Activity, AtSign, Brain, Briefcase, Building2, ChevronLeft, Database, Magnet, ScrollText, Search, Send, UsersRound, Workflow,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * The dashboard's window: its sidebar (`components/sidebar.tsx`, same items,
 * same order, same icons) and a content pane. Rendered under `.dark`, which
 * is the dashboard's shipped default, so the frame is the product as it
 * actually opens.
 */

export type AppView = 'chat' | 'workflow' | 'report' | 'leads' | 'diagnostics' | 'account' | 'linkedin' | 'company' | 'magnets' | 'memory' | 'databases'

const NAV: { id: AppView; label: string; icon: typeof Workflow }[] = [
  { id: 'workflow', label: 'Workflow', icon: Workflow },
  { id: 'report', label: 'Report', icon: ScrollText },
  { id: 'leads', label: 'Leads', icon: UsersRound },
  { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
  { id: 'account', label: 'Reddit account', icon: AtSign },
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'magnets', label: 'Magnets', icon: Magnet },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'databases', label: 'Databases', icon: Database },
]

export function AppFrame({
  view,
  onView,
  clientName = 'Pigeon',
  sessions = [],
  children,
  className = '',
}: {
  view: AppView
  onView?: (view: AppView) => void
  clientName?: string
  sessions?: string[]
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`dark overflow-hidden rounded-xl border border-white/10 bg-background text-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ${className}`}>
      {/* window chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-border/80 bg-sidebar px-3">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="mx-auto rounded-md bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">app.trypigeon.in/dashboard</span>
      </div>

      <div className="flex min-h-[520px]">
        <aside className="hidden w-[196px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <button type="button" tabIndex={-1} className="flex items-center gap-2 px-3 pt-3 text-[13px]">
            <ChevronLeft className="size-3.5 text-muted-foreground" />
            <span className="truncate font-medium">{clientName}</span>
            <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/70">client</span>
          </button>
          <div className="flex flex-col gap-0.5 px-3 pt-3">
            <Button
              variant="secondary"
              type="button"
              tabIndex={-1}
              className="h-9 justify-start gap-2.5 bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium hover:bg-sidebar-accent/70"
              onClick={() => onView?.('chat')}
            >
              <Send className="size-4" strokeWidth={1.8} />
              New Agent
            </Button>
            <Button variant="ghost" type="button" tabIndex={-1} className="h-8 justify-start gap-2.5 text-sm text-foreground/80">
              <Search className="size-4" strokeWidth={1.8} />
              Search
            </Button>
            {NAV.map((item) => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  type="button"
                  tabIndex={-1}
                  className={`h-8 justify-start gap-2.5 text-sm ${active ? 'bg-sidebar-accent text-foreground' : 'text-foreground/80'}`}
                  onClick={() => onView?.(item.id)}
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                  {item.label}
                </Button>
              )
            })}
          </div>
          {sessions.length > 0 && (
            <div className="mt-4 px-3">
              <p className="px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">Agents</p>
              <ul className="mt-1 space-y-0.5">
                {sessions.map((name, index) => (
                  <li key={name} className={`truncate rounded-md px-2 py-1 text-[13px] ${index === 0 && view === 'chat' ? 'bg-sidebar-accent text-foreground' : 'text-foreground/70'}`}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="min-w-0 flex-1 bg-background">{children}</div>
      </div>
    </div>
  )
}
