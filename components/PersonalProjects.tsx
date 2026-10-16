'use client'

import Image from 'next/image'
import { useLocale } from '@/components/LocaleProvider'
import { RevealIndex, Tile, type RevealEntry } from '@/components/RevealIndex'
import { getPersonalProjects, personalProjectCopy } from '@/lib/projects'
import pitchRelease from '@/config/pitch-release.json'
import { pitchLinks } from '@/lib/pitch-release'

/* Ventures as an index: point at a project, focus it, or move with the arrow
   keys, and its mark, story and link reveal one after another. A project
   without a confirmed public URL shows no link. #<id> opens a project.
   Social links ship only for audited, verified profiles, and the investor
   pitch stays invisible until its release gate is open. */
export default function PersonalProjects() {
  const locale = useLocale()
  const copy = personalProjectCopy[locale]
  const projects = getPersonalProjects(locale)
  const pitch = pitchLinks(pitchRelease)

  const entries: RevealEntry[] = projects.map((project) => ({
    key: project.id,
    anchor: project.id,
    panelClassName: `project-card project-card--${project.id}`,
    head: (
      <span className="reveal-head-text">
        <span className="reveal-title">{project.name}</span>
        <span className="reveal-sub">{project.category}</span>
      </span>
    ),
    panel: (
      <>
        <Tile order={0} className="project-visual">
          <Image
            src={project.visual.src}
            alt=""
            width={project.visual.width}
            height={project.visual.height}
            sizes="320px"
            loading="eager"
            className="project-logo"
          />
        </Tile>
        <Tile order={1} as="p" className="project-description">
          {project.description}
        </Tile>
        {project.slogan && (
          <Tile order={2} as="p" className="project-slogan">
            {project.slogan.map((phrase) => (
              <span key={phrase}>{phrase}</span>
            ))}
          </Tile>
        )}
        {project.url && (
          <Tile order={3}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`${copy.visit} ${project.name}, ${copy.newTab}`}
            >
              {copy.visit}
              <span aria-hidden="true">↗</span>
            </a>
          </Tile>
        )}
        {(project.socialLinks ?? []).map((link, index) => (
          <Tile key={link.href} order={4 + index}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`${link.label}, ${copy.newTab}`}
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          </Tile>
        ))}
        {pitch && project.id === 'scaleforged' && (
          <Tile order={6}>
            <a
              href={pitch[locale].href}
              className="project-link"
              aria-label={pitch[locale].label}
            >
              {pitch[locale].label}
              <span aria-hidden="true">↗</span>
            </a>
          </Tile>
        )}
      </>
    ),
  }))

  return (
    <section
      id="personal-projects"
      aria-labelledby="personal-projects-heading"
      className="personal-projects"
    >
      <div className="projects-heading projects-shell">
        <div className="section-label mb-8">
          <span className="num">06</span>
          <span className="name">{copy.label}</span>
        </div>
        <h2 id="personal-projects-heading" className="editorial-h2 text-3xl lg:text-4xl mb-4">
          {copy.heading}
        </h2>
        <p className="editorial-lead max-w-2xl">{copy.lead}</p>
      </div>

      <div className="projects-body projects-shell">
        <RevealIndex entries={entries} className="projects-index" />
      </div>
    </section>
  )
}
