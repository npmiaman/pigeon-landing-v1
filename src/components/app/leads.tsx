import { ChevronRight } from 'lucide-react'

/**
 * The lead table, ported from the dashboard's `components/leads-view.tsx`:
 * everyone a folder's crawls met, ranked ours-first, with what each of them
 * struggled with and where, in their own words.
 */

export type Lead = {
  username: string
  fit: 'ours' | 'adjacent' | 'unclear' | 'bystander' | 'vendor'
  role: string
  struggle: string
  signals: string
  where: string
  status: 'new' | 'drafted' | 'approved' | 'posted' | 'replied'
}

const FIT_LABEL: Record<Lead['fit'], { label: string; className: string }> = {
  ours: { label: 'Ours', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  adjacent: { label: 'Adjacent', className: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
  unclear: { label: 'Unclear', className: 'bg-muted text-muted-foreground' },
  bystander: { label: 'Bystander', className: 'bg-muted text-muted-foreground' },
  vendor: { label: 'Vendor', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
}

function FitPill({ fit }: { fit: Lead['fit'] }) {
  const f = FIT_LABEL[fit]
  return <span className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${f.className}`}>{f.label}</span>
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card/60">
      <table className="w-full text-[12.5px]">
        <thead className="text-left text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          <tr className="border-b">
            <th className="w-6 px-2 py-2"></th>
            <th className="w-6 px-1 py-2"><input type="checkbox" aria-label="Select every person shown" className="accent-foreground" readOnly /></th>
            <th className="px-3 py-2 font-medium">Person</th>
            <th className="px-3 py-2 font-medium">Fit</th>
            <th className="px-3 py-2 font-medium">Role</th>
            <th className="px-3 py-2 font-medium">Struggling with</th>
            <th className="px-3 py-2 font-medium">Signals</th>
            <th className="px-3 py-2 font-medium">Where</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((p) => (
            <tr key={p.username} className="align-top hover:bg-muted/30">
              <td className="px-2 py-2.5"><ChevronRight className="size-3.5 text-muted-foreground" /></td>
              <td className="px-1 py-2.5"><input type="checkbox" aria-label={`Select u/${p.username}`} className="accent-foreground" readOnly /></td>
              <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[12px]">u/{p.username}</td>
              <td className="px-3 py-2.5"><FitPill fit={p.fit} /></td>
              <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{p.role}</td>
              <td className="min-w-[220px] px-3 py-2.5 leading-snug">{p.struggle}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{p.signals}</td>
              <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11.5px] text-muted-foreground">{p.where}</td>
              <td className="px-3 py-2.5 capitalize text-muted-foreground">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
