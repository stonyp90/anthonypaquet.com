'use client'

import Image from 'next/image'
import { useLocale } from '@/components/LocaleProvider'
import { getPersonalProjects, personalProjectCopy } from '@/lib/projects'

/** A compact project list within the current ScaleForge experience. */
export default function ExperienceProjects() {
  const locale = useLocale()
  const copy = personalProjectCopy[locale]

  return (
    <div id="personal-projects" className="role-projects">
      <h4 id="role-projects-heading">{copy.productsLabel}</h4>
      <ul className="role-project-list" aria-labelledby="role-projects-heading">
        {getPersonalProjects(locale).map((project) => (
          <li id={project.id} key={project.id} className="role-project">
            {project.id === 'control-craft' && <span id="lunorive" className="legacy-project-anchor" aria-hidden="true" />}
            {project.id === 'offerduel' && <span id="offer-jewel" className="legacy-project-anchor" aria-hidden="true" />}
            <a
              href={project.url ?? `mailto:me@anthonypaquet.com?subject=${encodeURIComponent(copy.contactSubject)}`}
              target={project.url ? '_blank' : undefined}
              rel={project.url ? 'noopener noreferrer' : undefined}
              className="role-project-link"
              aria-label={project.url ? `${copy.visit} ${project.name}, ${copy.newTab}` : `${copy.contact}: ${project.name}`}
            >
              <span className="role-project-visual" aria-hidden="true">
                {project.visual && <Image src={project.visual.src} alt="" width={project.visual.width} height={project.visual.height} sizes={project.id === 'control-craft' ? '56px' : '32px'} className={`role-project-logo${project.id === 'control-craft' ? ' role-project-logo--wide' : ''}`} />}
              </span>
              <span className="role-project-copy">
                <span className="role-project-name">{project.name}</span>
                <span className="role-project-summary">{project.inDevelopment ? copy.development : project.category}</span>
              </span>
              <span className="role-project-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
