import { useState } from 'react'
import { Check, PauseCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/**
 * The build approval gate, ported from the dashboard's `components/session.tsx`
 * (`ApprovalPanel`): the plan, the options with one suggested, a box for
 * changes, and the button that starts the build. The run stops here until
 * the founder clicks.
 */

export type ApprovalQuestion = {
  title: string
  summary: string
  options?: { id: string; label: string; detail?: string; recommended?: boolean }[]
}

export function ApprovalPanel({ question, onApprove }: { question: ApprovalQuestion; onApprove?: (choice: string | undefined, notes: string) => void }) {
  const recommended = question.options?.find((option) => option.recommended)?.id
  const [choice, setChoice] = useState<string | undefined>(recommended ?? question.options?.[0]?.id)
  const [notes, setNotes] = useState('')

  return (
    <div className="border-t bg-amber-50/60 px-3 py-3 dark:bg-amber-950/20">
      <div className="flex items-start gap-2">
        <PauseCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{question.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">{question.summary}</p>

          {question.options && question.options.length > 1 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setChoice(option.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    choice === option.id ? 'border-amber-500 bg-background' : 'border-transparent bg-background/60 hover:border-border'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    {option.label}
                    {option.recommended && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-normal text-amber-800 dark:bg-amber-900 dark:text-amber-100">suggested</span>
                    )}
                  </span>
                  {option.detail && <span className="mt-0.5 block text-[11px] text-muted-foreground">{option.detail}</span>}
                </button>
              ))}
            </div>
          )}

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything to change before it starts? (optional — this overrides the plan)"
            className="mt-3 min-h-16 resize-none bg-background text-xs"
          />

          <div className="mt-2.5 flex items-center gap-2">
            <Button size="sm" type="button" onClick={() => onApprove?.(choice, notes.trim())}>
              <Check className="size-3.5" />
              {notes.trim() ? 'Start with these changes' : 'Approve and start'}
            </Button>
            <Button size="sm" variant="ghost" type="button">Cancel build</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
