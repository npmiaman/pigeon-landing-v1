import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AquaAnchor } from '@/components/aqua-button'
import { CALENDLY, EMAIL } from '@/lib/links'


function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = EMAIL
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        el.remove()
      } catch {
        return
      }
    }
    setCopied(true)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-white py-1 pr-1 pl-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="font-mono text-xs text-charcoal/80 select-all">{EMAIL}</span>
      <button
        type="button"
        onClick={copyEmail}
        aria-label={copied ? 'Email copied' : 'Copy email address'}
        className="grid h-7 w-7 place-items-center rounded-md text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-600" aria-hidden>
            <path d="m4.5 12.5 5 5 10-11" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  )
}

export function Cta() {
  return (
    <section className="border-t border-border">
      <div className="rail mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="dot-grid relative overflow-hidden rounded-2xl border border-border bg-white/70 px-6 py-14 text-center sm:px-12 sm:py-20">
          <span className="eyebrow">get in early</span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Give it your ICP. Read the report in the morning.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal/65 text-pretty">
            Pigeon is in early access. Book thirty minutes with the founder and bring the ICP you are stuck on.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <AquaAnchor href={CALENDLY} target="_blank" rel="noreferrer" size="lg">
              Talk to the founder
            </AquaAnchor>
          </div>
          <div className="mt-6"><CopyEmail /></div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="rail mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/" aria-label="Pigeon home" className="inline-flex items-center gap-2.5">
              <img src="/workwithpigeon_logo.png" alt="" className="h-8 w-8 [image-rendering:pixelated]" />
              <span className="font-display text-lg font-semibold tracking-tight">Pigeon</span>
            </Link>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-charcoal/60">An AI coworker for founders doing things that don't scale.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[13px] sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-charcoal/45">Product</p>
              <ul className="mt-3 space-y-2 text-charcoal/75">
                <li><a href="#how-it-works" className="hover:text-ink">How it works</a></li>
                <li><a href="#product" className="hover:text-ink">The product</a></li>
                <li><a href="#numbers" className="hover:text-ink">Numbers</a></li>
                <li><a href="#rules" className="hover:text-ink">Rules</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-charcoal/45">Company</p>
              <ul className="mt-3 space-y-2 text-charcoal/75">
                <li><a href={CALENDLY} target="_blank" rel="noreferrer" className="hover:text-ink">Talk to the founder</a></li>
                <li><a href={`mailto:${EMAIL}`} className="hover:text-ink">{EMAIL}</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-charcoal/45">Reading</p>
              <ul className="mt-3 space-y-2 text-charcoal/75">
                <li><a href="https://paulgraham.com/ds.html" target="_blank" rel="noreferrer" className="hover:text-ink">Do things that don't scale</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[11px] text-charcoal/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Pigeon · trypigeon.in</span>
          <span>nothing posts without you</span>
        </div>
      </div>
    </footer>
  )
}
