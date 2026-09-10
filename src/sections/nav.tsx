import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AquaAnchor } from '@/components/aqua-button'
import { CALENDLY } from '@/lib/links'

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#product', label: 'Product' },
  { href: '#numbers', label: 'Numbers' },
  { href: '#rules', label: 'Rules' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${scrolled ? 'border-border bg-paper/85 backdrop-blur' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-8 px-6 sm:px-10">
        <Link to="/" aria-label="Pigeon home" className="inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <img id="nav-pigeon" src="/workwithpigeon_logo.png" alt="" className="h-12 w-12 [image-rendering:pixelated]" />
          <span className="font-display text-lg font-semibold tracking-tight">Pigeon</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-[13px] font-medium text-charcoal/65 transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AquaAnchor href={CALENDLY} target="_blank" rel="noreferrer" size="sm">Talk to the founder</AquaAnchor>
        </div>
      </div>
    </header>
  )
}
