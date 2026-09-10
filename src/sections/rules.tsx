import { Section } from '@/sections/section'
import { RULES } from '@/demo/data'

/**
 * The ten rules that hold everywhere, from the canon. Most of them exist
 * because something failed in production once and was never allowed to
 * fail that way again.
 */
export function Rules() {
  return (
    <Section
      id="rules"
      index={4}
      total={6}
      eyebrow="the rules"
      title="Ten rules that hold everywhere. Most were paid for."
      lede="A room dropped for the wrong reason, a report that claimed five communities it never read, a crawl that read 100 of 253 threads and called it complete. Each of these became a rule, and the rules are structural, not settings."
    >
      <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {RULES.map((rule, index) => (
          <li key={rule.title} className="flex gap-4 bg-paper p-5 sm:p-6">
            <span className="font-mono text-[11px] tabular-nums text-ember">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-display text-[16px] font-semibold leading-snug tracking-tight">{rule.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-charcoal/65">{rule.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
