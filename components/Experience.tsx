'use client'

import Image from 'next/image'
import { useContent, useLocale } from '@/components/LocaleProvider'
import { RevealIndex, Tile, type RevealEntry } from '@/components/RevealIndex'
import ExperienceProjects from '@/components/ExperienceProjects'
import { getStudio } from '@/lib/projects'

type Role = ReturnType<typeof useContent>['experiences'][number]
type Labels = ReturnType<typeof useContent>['ui']['experience']

/* The track record as an index of roles: point at a role, focus it, or move
   with the arrow keys, and its details reveal one tile after another. */
export default function Experience() {
  const c = useContent()
  const labels = c.ui.experience

  const entries: RevealEntry[] = c.experiences.map((role, index) => ({
    key: `${role.company}::${role.position}::${index}`,
    anchor: role.company === 'ScaleForge' ? 'scaleforged' : undefined,
    head: <RoleHead role={role} labels={labels} />,
    panel: <RoleDetails role={role} labels={labels} />,
  }))

  return (
    <section className="experience-section section-grid py-20 lg:py-28" id="experience">
      <div className="experience-shell mx-auto max-w-6xl px-6 lg:px-12">
        <div className="mb-12">
          <div className="section-label mb-8">
            <span className="num">04</span>
            <span className="name">{labels.label}</span>
          </div>
          <h2 className="editorial-h2 text-3xl lg:text-4xl mb-4">{labels.heading}</h2>
          <p className="editorial-lead max-w-xl">{labels.lead}</p>
        </div>

        <RevealIndex entries={entries} className="experience-index" />
      </div>
    </section>
  )
}

function RoleHead({ role, labels }: { role: Role; labels: Labels }) {
  const flag = role.period === 'Current' ? labels.current : role.period === 'Founded' ? labels.founder : null
  return (
    <>
      <span className="reveal-head-text">
        <span className="reveal-title">{role.company}</span>
        <span className="reveal-sub">{role.position}{role.duration && <span className="role-duration"> · {role.duration}</span>}</span>
      </span>
      {flag && <span className="reveal-flag">{flag}</span>}
    </>
  )
}

function RoleDetails({ role, labels }: { role: Role; labels: Labels }) {
  const locale = useLocale()
  const studio = role.company === 'ScaleForge' ? getStudio(locale) : null
  const { url, via } = role as { url?: string; via?: string }
  const outcomes = role.outcomes ?? []
  const firstHighlight = 2 + outcomes.length

  return (
    <>
      <Tile order={0} className={`role-intro${studio ? ' role-intro--studio' : ''}`}>
        <div>
          <p className="role-title">{role.position}</p>
          <p className="role-company">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {role.company}
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              role.company
            )}
            {via && <span className="role-via">{labels.via} {via}</span>}
          </p>
          <p className="role-location">{role.location}</p>
        </div>
        {studio && <div className="role-studio-mark"><Image src={studio.visual.src} alt={studio.name} width={studio.visual.width} height={studio.visual.height} sizes="128px" className="role-studio-logo" /></div>}
      </Tile>

      <Tile order={1} as="p" className="role-description">
        {role.description}
      </Tile>

      {studio && <Tile order={2}><ExperienceProjects /></Tile>}

      {outcomes.length > 0 && (
        <div className="role-outcomes">
          {outcomes.slice(0, 3).map((outcome, index) => (
            <Tile key={outcome.metric} order={2 + index} className="role-outcome">
              <span className="role-metric">{outcome.metric}</span>
              <span className="role-metric-label">{outcome.description}</span>
            </Tile>
          ))}
        </div>
      )}

      {role.achievements.length > 0 && <ul className="role-highlights" aria-label={labels.keyAchievements}>
        {role.achievements.map((achievement, index) => (
          <Tile key={achievement} order={firstHighlight + index} as="li">
            {achievement}
          </Tile>
        ))}
      </ul>}

      {role.tags.length > 0 && <Tile order={firstHighlight + role.achievements.length} className="role-tags">
        {role.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Tile>}
    </>
  )
}
