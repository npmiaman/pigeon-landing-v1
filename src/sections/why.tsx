import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Section } from '@/sections/section'

/**
 * The founders' fan from the first version of the site, kept: it is the
 * argument for the whole product in seven photographs. Hand-placed rotation
 * and drop so the row reads as prints tossed on a table rather than a
 * machine-fanned arch; cards stack left-under-right like a hand dealt left
 * to right.
 */
type FanCard = { img: string; note: string; rot: number; dy: number }

const fan: FanCard[] = [
  { img: '/youtube-founders.png', note: 'Offered strangers $100 to upload videos', rot: -10, dy: 34 },
  { img: '/canva-founders.png', note: 'Sold school yearbooks one call at a time', rot: -7, dy: 15 },
  { img: '/collisons.jpg', note: "Installed Stripe on users' laptops in person", rot: -3, dy: 3 },
  { img: '/airbnb-obamaos.png', note: 'Sold cereal to keep Airbnb alive', rot: 1, dy: 0 },
  { img: '/drew-houston.png', note: 'Paid strangers $40 to watch them struggle', rot: 4, dy: 4 },
  { img: '/aaron-swartz.webp', note: 'Ran fake accounts themselves for months', rot: 8, dy: 14 },
  { img: '/paypal-founders.webp', note: 'Built a bot that forced eBay sellers to join', rot: 12, dy: 30 },
]

export function Why() {
  const [quoteLit, setQuoteLit] = useState(false)
  const [cardLoaded, setCardLoaded] = useState<boolean[]>(() => fan.map(() => false))

  return (
    <Section
      id="why"
      index={5}
      total={6}
      eyebrow="why"
      title={
        <>
          Every generational company started by{' '}
          <q
            cite="https://paulgraham.com/ds.html"
            className={`box-decoration-clone -mx-1 rounded px-1 transition-colors duration-200 ${quoteLit ? 'bg-ember-soft' : 'bg-transparent'}`}
          >
            doing things that don't scale.
          </q>
        </>
      }
      lede={
        <span className="inline-flex items-center gap-3">
          <span>Pigeon gives you an AI coworker to do the same, only faster.</span>
          <a
            href="https://paulgraham.com/ds.html"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setQuoteLit(true)}
            onMouseLeave={() => setQuoteLit(false)}
            onFocus={() => setQuoteLit(true)}
            onBlur={() => setQuoteLit(false)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white py-1 pr-3 pl-1 text-[12px] text-charcoal/70 transition-colors hover:text-ink"
          >
            <img src="/pg.png" alt="" className="h-6 w-6 rounded-full object-cover object-[50%_28%] ring-1 ring-black/10" />
            Paul Graham, 2013
          </a>
        </span>
      }
    >
      <div className="flex items-start justify-center pb-12" aria-hidden>
        {fan.map((card, i) => (
          <div
            key={card.img}
            className="group relative -mx-1 shrink-0 hover:!z-50"
            style={{ zIndex: i + 1, transform: `rotate(${card.rot}deg) translateY(${card.dy}px)` }}
          >
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-6 -translate-x-1/2 translate-y-1 rounded-full bg-ink px-3 py-1.5 font-sans text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              {card.note}
              <span className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
            </span>
            <div className="relative h-20 w-20 overflow-hidden rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-transform duration-300 ease-out hover:-translate-y-5 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
              {!cardLoaded[i] && <Skeleton className="absolute inset-0 rounded-none" />}
              <img
                src={card.img}
                alt=""
                onLoad={() => setCardLoaded((prev) => { const next = [...prev]; next[i] = true; return next })}
                className={`h-full w-full object-cover transition-opacity duration-300 ${cardLoaded[i] ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
