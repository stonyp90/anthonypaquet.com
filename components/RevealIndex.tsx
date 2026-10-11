'use client'

/* ==========================================================================
   REVEAL INDEX — an index of entries whose details reveal on demand.
   Wide screens: the index sits on the left and the active entry's details
   stay in view on the right. Pointing at an entry, focusing it, or moving with
   the arrow keys reveals it, and its tiles come in one after another.
   Narrow screens: the same markup reads as an accordion that opens in place.
   Every entry and its details stay in the exported HTML. An entry with an
   anchor also opens from a link to it elsewhere on the page (#lunorive).
   ========================================================================== */

import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'

export type RevealEntry = {
  key: string
  /** Fragment that opens this entry from a link, without the leading #. */
  anchor?: string
  /** What the index shows for the entry. */
  head: ReactNode
  /** The details, usually built from Tile elements. */
  panel: ReactNode
  /** Extra classes for the details wrapper. */
  panelClassName?: string
}

const WIDE = '(min-width: 1024px)'
const HOVER_INTENT_MS = 70

/** One block of revealed details. `order` sets its place in the cascade. */
export function Tile({
  order,
  className = '',
  as: Tag = 'div',
  children,
}: {
  order: number
  className?: string
  as?: 'div' | 'li' | 'p'
  children: ReactNode
}) {
  return (
    <Tag className={`reveal-tile ${className}`} style={{ '--i': order } as CSSProperties}>
      {children}
    </Tag>
  )
}

export function RevealIndex({
  entries,
  className = '',
  initial = 0,
}: {
  entries: RevealEntry[]
  className?: string
  initial?: number
}) {
  const baseId = useId()
  const [active, setActive] = useState<number | null>(initial)
  const [wide, setWide] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const intent = useRef<number | undefined>(undefined)
  const pending = useRef<number | null>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const media = window.matchMedia(WIDE)
    const update = () => setWide(media.matches)
    update()
    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
      window.clearTimeout(intent.current)
    }
  }, [])

  // A link to an entry's anchor opens it, on arrival or from elsewhere on the page.
  const anchors = entries.map((entry) => entry.anchor ?? '').join(' ')
  useEffect(() => {
    const list = anchors.split(' ')
    const openFromHash = () => {
      const target = window.location.hash.slice(1)
      const index = target ? list.indexOf(target) : -1
      if (index < 0) return
      setActive(index)
      // Side by side, show the whole index so the details beside it are in view
      // (the sticky details cannot sit beside the last row). Stacked, the entry
      // that closes above can move this one, so bring it back.
      window.requestAnimationFrame(() => {
        const element = window.matchMedia(WIDE).matches ? root.current : triggers.current[index]
        element?.scrollIntoView({ block: 'start' })
      })
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [anchors])

  // Side by side, one entry is always on show. Stacked, everything can close.
  const shown = wide ? (active ?? initial) : active

  const focusEntry = (index: number) => {
    const count = entries.length
    triggers.current[(index + count) % count]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: entries.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    focusEntry(moves[event.key])
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (!wide || event.pointerType !== 'mouse') return
    const previous = pointer.current
    pointer.current = { x: event.screenX, y: event.screenY }
    // Content scrolling under a still pointer is not a hover, so keyboard
    // navigation keeps control until the mouse really moves.
    if (previous && previous.x === event.screenX && previous.y === event.screenY) return
    if (index === shown || index === pending.current) return
    window.clearTimeout(intent.current)
    pending.current = index
    intent.current = window.setTimeout(() => {
      pending.current = null
      setActive(index)
    }, HOVER_INTENT_MS)
  }

  const onPointerLeave = () => {
    window.clearTimeout(intent.current)
    pending.current = null
  }

  const onClick = (index: number) => {
    if (wide) {
      setActive(index)
      return
    }
    const opening = active !== index
    setActive(opening ? index : null)
    if (opening) {
      // Closing the entry above can pull this one out of view, so bring it back.
      window.requestAnimationFrame(() => triggers.current[index]?.scrollIntoView({ block: 'nearest' }))
    }
  }

  return (
    <div
      ref={root}
      className={`reveal-index ${className}`}
      style={{ '--count': entries.length } as CSSProperties}
    >
      {entries.map((entry, index) => {
        const open = shown === index
        const triggerId = `${baseId}-entry-${index}`
        const panelId = `${baseId}-details-${index}`
        return (
          <Fragment key={entry.key}>
            <h3 id={entry.anchor} className="reveal-head" style={{ '--row': index + 1 } as CSSProperties}>
              <button
                ref={(node) => {
                  triggers.current[index] = node
                }}
                id={triggerId}
                type="button"
                className="reveal-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => onClick(index)}
                onFocus={() => wide && setActive(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                onPointerMove={(event) => onPointerMove(event, index)}
                onPointerLeave={onPointerLeave}
              >
                {entry.head}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`reveal-panel ${entry.panelClassName ?? ''}`}
              hidden={!open}
            >
              {entry.panel}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
