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
import type { PersonalProject } from '@/lib/projects'

/* The product the loop shipped. Its Personal projects entry opens from #lunorive. */
const LOOP_OUTPUT: PersonalProject['id'] = 'lunorive'

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
      footer={<LoopFoundations foundations={c.ui.work.foundations} />}
    />
  )
}

type Foundations = ReturnType<typeof useContent>['ui']['work']['foundations']

/* What else runs in the loop (the business itself), how it is built, how it
   reviews itself, and what it has shipped. */
function LoopFoundations({ foundations }: { foundations: Foundations }) {
  return (
    <div className="mt-16 border-t border-[var(--color-border)] pt-12 lg:mt-20">
      <p className="editorial-lead mb-10 max-w-3xl">{foundations.intro}</p>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-14">
        <FoundationList title={foundations.businessTitle} items={foundations.business} />
        <FoundationList title={foundations.buildTitle} items={foundations.build} />
        <FoundationList title={foundations.reviewTitle} items={foundations.review} />
        <LoopOutput output={foundations.output} />
      </div>
    </div>
  )
}

function LoopOutput({ output }: { output: Foundations['output'] }) {
  return (
    <div>
      <h3 className="editorial-eyebrow mb-4">{output.title}</h3>
      <div className="stat-block loop-output">
        <p className="v">
          {output.name}
          <span className="accent-text">.</span>
        </p>
        <p className="loop-output-blurb">{output.blurb}</p>
        <a href={`#${LOOP_OUTPUT}`} className="link-arrow loop-output-link">
          {output.cta}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  )
}

function FoundationList({ title, items }: { title: string; items: Foundations['business'] }) {
  return (
    <div>
      <h3 className="editorial-eyebrow mb-4">{title}</h3>
      <ul className="clean-list">
        {items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>. {item.blurb}
          </li>
        ))}
      </ul>
    </div>
  )
}
