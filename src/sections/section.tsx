import type { ReactNode } from 'react'

/**
 * One numbered section of the page: a bracketed monospace eyebrow with the
 * section's place in the sequence, a display heading, and a one-paragraph
 * lede. Every section is framed by the same hairline rails so the page reads
 * as a single drawn sheet.
 */
export function Section({
  id, index, total, eyebrow, title, lede, children, className = '',
}: {
  id: string
  index: number
  total: number
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-border ${className}`}>
      <div className="rail mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow">{eyebrow}</span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-charcoal/40">
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {lede && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-charcoal/65 text-pretty sm:text-base">{lede}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

/** A small bracketed label, used over the product frames. */
export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'ember' }) {
  return (
    <span className={`font-mono text-[10.5px] uppercase tracking-[0.12em] ${tone === 'ember' ? 'text-ember' : 'text-charcoal/50'}`}>
      <span className="text-charcoal/35">[ </span>{children}<span className="text-charcoal/35"> ]</span>
    </span>
  )
}
