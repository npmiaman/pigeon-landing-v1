import { Section } from '@/sections/section'
import { NUMBERS } from '@/demo/data'

/**
 * The bounds a run works under, each one read out of a named constant. The
 * source line under each number is the point: these are not marketing
 * numbers, they are the numbers.
 */
export function Numbers() {
  return (
    <Section
      id="numbers"
      index={3}
      total={6}
      eyebrow="by the numbers"
      title="Every number is a constant in the code, and it says which one."
      lede="A run is bounded, and every bound is reported. A stage that looked at 80 of 160 says so in the report."
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {NUMBERS.map((n) => (
          <div key={n.source} className="flex flex-col bg-paper p-5 sm:p-6">
            <span className="font-display text-4xl font-semibold tracking-tight tabular-nums text-ink sm:text-5xl">{n.value}</span>
            <span className="mt-2 text-[14px] leading-snug text-charcoal/80">{n.label}</span>
            <span className="mt-4 font-mono text-[10.5px] leading-relaxed text-charcoal/45 [overflow-wrap:anywhere]">{n.source}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
