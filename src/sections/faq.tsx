import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Section } from '@/sections/section'
import { FAQ } from '@/demo/data'

export function Faq() {
  const [open, setOpen] = useState<number>(0)
  return (
    <Section id="faq" index={6} total={6} eyebrow="questions" title="The questions founders ask first.">
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white/60">
        {FAQ.map((item, index) => {
          const on = open === index
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(on ? -1 : index)}
                aria-expanded={on}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white sm:px-6"
              >
                <span className="font-mono text-[11px] tabular-nums text-charcoal/40">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex-1 text-[15px] font-medium text-ink">{item.q}</span>
                <Plus className={`size-4 shrink-0 text-charcoal/50 transition-transform duration-200 ${on ? 'rotate-45' : ''}`} />
              </button>
              {on && <p className="px-5 pb-5 pl-[3.25rem] text-[14px] leading-relaxed text-charcoal/70 sm:px-6 sm:pl-[3.5rem]">{item.a}</p>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
