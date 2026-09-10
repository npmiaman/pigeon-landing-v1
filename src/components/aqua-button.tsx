import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * The primary button: a glossy blue pill in the old Aqua manner, light at
 * the top, deeper at the bottom, a white gloss across the upper half, a thin
 * navy edge, black text. One style for every "do the thing" on the site.
 * The gradient and gloss live in `.aqua` in index.css.
 */

type Size = 'sm' | 'md' | 'lg'
type Tone = 'blue' | 'grey'

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-7 text-[17px]',
}

const TONE: Record<Tone, string> = { blue: 'aqua', grey: 'aqua aqua-grey' }

const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.012em] text-ink select-none'

export function AquaLink({ to, size = 'md', tone = 'blue', className = '', children, ...rest }: { to: string; size?: Size; tone?: Tone; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>) {
  return (
    <Link to={to} className={`${TONE[tone]} ${base} ${SIZE[size]} ${className}`} {...rest}>
      <span className="relative">{children}</span>
    </Link>
  )
}

export function AquaAnchor({ href, size = 'md', tone = 'blue', className = '', children, ...rest }: { href: string; size?: Size; tone?: Tone; className?: string; children: ReactNode } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>) {
  return (
    <a href={href} className={`${TONE[tone]} ${base} ${SIZE[size]} ${className}`} {...rest}>
      <span className="relative">{children}</span>
    </a>
  )
}

export function AquaButton({ size = 'md', tone = 'blue', className = '', children, ...rest }: { size?: Size; tone?: Tone; className?: string; children: ReactNode } & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button className={`${TONE[tone]} ${base} ${SIZE[size]} disabled:opacity-60 ${className}`} {...rest}>
      <span className="relative">{children}</span>
    </button>
  )
}
