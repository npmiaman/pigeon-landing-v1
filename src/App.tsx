import { useRef, useState } from 'react'

const CONTACT_EMAIL = 'aman@trypigeon.in'
const CALENDLY = 'https://calendly.com/aman-trypigeon/30min'

// Hand-placed, not formula-placed: rotation and drop carry a little deliberate
// jitter so the row reads as prints tossed on a table rather than a
// machine-fanned arch. Cards stack strictly left-under-right — each card sits
// on top of its left neighbour, like a hand dealt left to right — so z-order
// comes from the index at render time. `img` on a card replaces its gradient.
type FanCard = { art: string; rot: number; dy: number; img?: string; note?: string }

const fan: FanCard[] = [
  {
    art: 'linear-gradient(150deg,#f6d68a,#d99a3e)',
    img: '/youtube-founders.png',
    note: 'Uploaded the first videos themselves',
    rot: -10,
    dy: 34,
  },
  {
    art: 'linear-gradient(150deg,#2d3b52,#0f1723)',
    img: '/canva-founders.png',
    note: 'Pitched 100+ investors before a yes',
    rot: -7,
    dy: 15,
  },
  {
    art: 'linear-gradient(150deg,#cfe3f7,#8fb6d8)',
    img: '/collisons.jpg',
    note: "Installed Stripe on users' laptops in person",
    rot: -3,
    dy: 3,
  },
  {
    art: 'linear-gradient(150deg,#de3b26,#8f1616)',
    img: '/airbnb-obamaos.png',
    note: 'Sold cereal to keep Airbnb alive',
    rot: 1,
    dy: 0,
  },
  {
    art: 'linear-gradient(150deg,#d7ead2,#8fbf94)',
    img: '/drew-houston.png',
    note: 'Answered every support email himself',
    rot: 4,
    dy: 4,
  },
  {
    art: 'linear-gradient(150deg,#8ddcd2,#2f8f8a)',
    img: '/aaron-swartz.webp',
    note: 'Rewrote all of Reddit by hand',
    rot: 8,
    dy: 14,
  },
  {
    art: 'linear-gradient(150deg,#f7c9dd,#c07fd0)',
    img: '/paypal-founders.webp',
    note: 'Paid every new user $10 to join',
    rot: 12,
    dy: 30,
  },
]

function App() {
  const [quoteLit, setQuoteLit] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
    } catch {
      // clipboard API unavailable (http, old browser) — fall back to a selection copy
      const el = document.createElement('textarea')
      el.value = CONTACT_EMAIL
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    }
    setCopied(true)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper font-sans text-ink antialiased selection:bg-[#ffd60a] selection:text-ink">
      <header className="relative z-20 px-4 pt-5 pb-2 sm:px-6">
        <a
          href="#"
          aria-label="Pigeon home"
          className="inline-flex items-center gap-2.5 transition-transform hover:-translate-y-0.5"
        >
          <img
            src="/workwithpigeon_logo.png"
            alt=""
            className="h-11 w-11 [image-rendering:pixelated]"
          />
          <span className="font-display text-xl font-semibold tracking-tight">Pigeon</span>
        </a>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center">
          <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-0">
            {/* mirrors the photo's width so the heading stays optically centred */}
            <div className="hidden w-12 shrink-0 md:block" aria-hidden />

            <h1 className="max-w-4xl min-w-0 font-display text-2xl leading-[1.18] font-semibold tracking-tight text-balance sm:text-3xl lg:text-[2.375rem]">
              Pigeon is the world's first agent built to help founders{' '}
              <q
                cite="https://paulgraham.com/ds.html"
                className={`box-decoration-clone -mx-1 rounded px-1 transition-colors duration-200 ${
                  quoteLit ? 'bg-sky-200' : 'bg-transparent'
                }`}
              >
                do things that don't scale.
              </q>
            </h1>

            <div
              className="group relative w-12 shrink-0 md:translate-y-8"
              onMouseEnter={() => setQuoteLit(true)}
              onMouseLeave={() => setQuoteLit(false)}
              onFocus={() => setQuoteLit(true)}
              onBlur={() => setQuoteLit(false)}
              tabIndex={0}
            >
              <svg
                viewBox="0 0 46 36"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`pointer-events-none absolute top-0 right-full mr-1 hidden h-9 w-[46px] -translate-y-1 transition-opacity duration-200 md:block ${
                  quoteLit ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <path d="M42 31C28 32 11 26 7 8" />
                <path d="M7 8L5 16M7 8L12 14" />
              </svg>

              <img
                src="/pg.png"
                alt="Paul Graham"
                className="h-12 w-12 rounded-md object-cover object-[50%_28%] ring-1 ring-black/10"
              />

              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 font-sans text-[11px] whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
              >
                Quote by Paul Graham
              </span>
            </div>
          </div>

          {/* fanned hand of cards — outer cards rotate and drop, so pad the
              bottom for the extra height their transforms add */}
          <div className="mt-12 flex items-start justify-center pb-12 sm:mt-14" aria-hidden>
            {fan.map((card, i) => (
              <div
                key={i}
                className="group relative -mx-1 shrink-0 hover:!z-50"
                style={{
                  zIndex: i + 1,
                  transform: `rotate(${card.rot}deg) translateY(${card.dy}px)`,
                }}
              >
                {card.note && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-6 -translate-x-1/2 translate-y-1 rounded-full bg-[#1976d2] px-3 py-1.5 font-sans text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    {card.note}
                    <span className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1976d2]" />
                  </span>
                )}

                <div
                  className="h-20 w-20 overflow-hidden rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-transform duration-300 ease-out hover:-translate-y-5 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                  style={{ background: card.art }}
                >
                  {card.img && (
                    <img src={card.img} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/60 text-pretty">
            Every generational company started by doing things that didn't scale. Pigeon gives
            you an AI coworker to do the same, only faster.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-charcoal px-6 py-2.5 font-sans text-sm font-medium text-white transition-opacity hover:opacity-85"
            >
              Talk to the founder
            </a>
            <a
              href="https://paulgraham.com/ds.html"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 font-sans text-sm font-medium text-charcoal/70 transition-colors hover:text-charcoal"
            >
              Read the essay
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              >
                <path d="M7 17 17 7m0 0H8m9 0v9" />
              </svg>
            </a>
          </div>

          {/* shadcn-style inline email + copy control */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-charcoal/15 bg-white py-1 pr-1 pl-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span className="font-mono text-xs text-charcoal/80 select-all">{CONTACT_EMAIL}</span>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? 'Email copied' : 'Copy email address'}
              className="grid h-7 w-7 place-items-center rounded-md text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
            >
              {copied ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 text-emerald-600"
                  aria-hidden
                >
                  <path d="m4.5 12.5 5 5 10-11" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}

export default App
