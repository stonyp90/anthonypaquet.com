'use client'

/* ==========================================================================
   DEVELOPMENT CYCLE — how Anthony delivers, animated.
   Renders the EXACT ScaleForged iteration-loop animation
   (components/IterationLoop.tsx, copied verbatim) with this site's English
   content. Phase icons (lucide-react) follow the agent loop: speak, unblock,
   iterate, ship.
   ========================================================================== */

import { Mic, LockOpen, Repeat, Rocket } from 'lucide-react'
import { IterationLoopSection, type LoopPhase } from '@/components/IterationLoop'
import { useContent } from '@/components/LocaleProvider'

export default function DevelopmentCycle() {
  const c = useContent()

  /* Exactly four phases, ordered clockwise starting at the top. */
  const phaseIcons = [Mic, LockOpen, Repeat, Rocket]
  const PHASES = phaseIcons.map((icon, i) => ({
    tag: c.ui.work.phases[i].tag,
    title: c.ui.work.phases[i].title,
    icon,
    blurb: c.ui.work.phases[i].blurb,
  })) as [LoopPhase, LoopPhase, LoopPhase, LoopPhase]

  return (
    <IterationLoopSection
      id="how-i-work"
      sectionNum="02"
      sectionName={c.ui.work.sectionName}
      heading={
        <>
          {c.ui.work.headingLead} <span className="accent-text">{c.ui.work.headingAccent}</span>.
        </>
      }
      lead={c.ui.work.lead}
      pull={c.ui.work.pull}
      phases={PHASES}
      centerEyebrow={c.ui.work.centerEyebrow}
      centerLabel={c.ui.work.centerLabel}
      loopHint={c.ui.work.loopHint}
      interactHint={c.ui.work.interactHint}
    />
  )
}
