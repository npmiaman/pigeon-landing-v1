import { useState } from 'react'
import { ArrowUp, ChevronDown, Plus, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/**
 * The dashboard's composer (`components/composer.tsx`), same box, same
 * buttons, same placeholder. The model and project pickers are drawn but
 * inert: on the website there is nothing behind them to pick.
 */
export function Composer({
  onSend,
  onStop,
  busy = false,
  docked = false,
  autoFocus = false,
  defaultValue = '',
}: {
  onSend?: (text: string) => void
  onStop?: () => void
  busy?: boolean
  docked?: boolean
  autoFocus?: boolean
  defaultValue?: string
}) {
  const [prompt, setPrompt] = useState(defaultValue)
  const hasPrompt = prompt.trim().length > 0

  const submit = () => {
    const text = prompt.trim()
    if (!text) return
    setPrompt('')
    onSend?.(text)
  }

  return (
    <div className="relative w-full max-w-2xl">
      {!docked && (
        <div className="flex items-center pl-1">
          <Button variant="ghost" size="sm" className="gap-1.5 px-2 font-normal text-foreground/80" type="button" tabIndex={-1}>
            first-100-users
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      )}

      <div className="mt-1.5 rounded-2xl border bg-card text-left shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
        <Textarea
          autoFocus={autoFocus}
          placeholder={busy ? 'Pigeon is working - your message will queue…' : 'Describe your ICP to begin research…'}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          className="max-h-[40vh] min-h-16 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent px-4 pt-4 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center gap-2 p-2.5">
          <Button variant="outline" size="icon-sm" className="rounded-full" aria-label="Add context" type="button" tabIndex={-1}>
            <Plus className="text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 px-2 font-normal" type="button" tabIndex={-1}>
            Auto
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="icon"
            type="button"
            disabled={!busy && !hasPrompt}
            className={`ml-auto rounded-full ${
              busy && !hasPrompt ? 'bg-primary text-primary-foreground hover:bg-primary/90' : hasPrompt ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground'
            }`}
            aria-label={busy && !hasPrompt ? 'Stop' : 'Send'}
            onClick={busy && !hasPrompt ? onStop : submit}
          >
            {busy && !hasPrompt ? <Square className="size-3 fill-current" /> : <ArrowUp />}
          </Button>
        </div>
      </div>

      {!docked && (
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full font-normal text-foreground/80" type="button" tabIndex={-1}>
            Plan New Idea
            <span className="text-muted-foreground">⇧Tab</span>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full font-normal text-foreground/80" type="button" tabIndex={-1}>
            Multitask
          </Button>
        </div>
      )}
    </div>
  )
}
