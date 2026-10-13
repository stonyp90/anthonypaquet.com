'use client'

/* ==========================================================================
   DEVELOPMENT CYCLE — how Anthony delivers, animated.
   Renders the iteration-loop animation (components/IterationLoop.tsx) with
   this site's content: one ring that runs the whole lifecycle, from the voice
   note through engineering to the sale and back.
   ========================================================================== */

import {
  Mic,
  ListChecks,
  LockOpen,
  Hexagon,
  Hammer,
  Repeat,
  FlaskConical,
  GitCompareArrows,
  Rocket,
  Eye,
  TrendingUp,
  RotateCcw,
} from 'lucide-react'
import { IterationLoopSection } from '@/components/IterationLoop'
import { useContent } from '@/components/LocaleProvider'

/* One icon per step, in the order of c.ui.work.phases. Keeping this mapping
   local to the adapter lets the content remain data-only in both locales. */
const PHASE_ICONS = [
  Mic,
  ListChecks,
  LockOpen,
  Hexagon,
  Hammer,
  Repeat,
  FlaskConical,
  GitCompareArrows,
  Rocket,
  Eye,
  TrendingUp,
  RotateCcw,
]

export default function DevelopmentCycle() {
  const c = useContent()

  const phases = c.ui.work.phases.map((phase, i) => ({ ...phase, icon: PHASE_ICONS[i] }))

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
      phases={phases}
      centerEyebrow={c.ui.work.centerEyebrow}
      centerLabel={c.ui.work.centerLabel}
      loopHint={c.ui.work.loopHint}
      interactHint={c.ui.work.interactHint}
    />
  )
}
