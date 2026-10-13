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
import type { PersonalProject } from '@/lib/projects'

/* The product the loop shipped. Its Personal projects entry opens from #lunorive. */
const LOOP_OUTPUT: PersonalProject['id'] = 'lunorive'

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
      footer={<LoopProof proof={c.ui.work.proof} />}
    />
  )
}

type Proof = ReturnType<typeof useContent>['ui']['work']['proof']

/* What the loop reaches beyond the code, and the product it shipped. */
function LoopProof({ proof }: { proof: Proof }) {
  return (
    <div className="mt-16 grid items-center gap-10 border-t border-[var(--color-border)] pt-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">
      <p className="editorial-lead max-w-xl">{proof.intro}</p>
      <div>
        <h3 className="editorial-eyebrow mb-4">{proof.title}</h3>
        <div className="stat-block loop-output">
          <p className="v">
            {proof.name}
            <span className="accent-text">.</span>
          </p>
          <p className="loop-output-blurb">{proof.blurb}</p>
          <a href={`#${LOOP_OUTPUT}`} className="link-arrow loop-output-link">
            {proof.cta}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </div>
  )
}
