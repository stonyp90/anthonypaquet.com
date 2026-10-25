'use client'

import Image from 'next/image'
import { useLocale } from '@/components/LocaleProvider'
import { getPersonalProjects, getStudio, personalProjectCopy } from '@/lib/projects'
import pitchRelease from '@/config/pitch-release.json'
import { pitchLinks } from '@/lib/pitch-release'

/* The studio is the parent, with a visible product collection below it.
   Every description and destination remains in the exported HTML. */
export default function PersonalProjects() {
  const locale = useLocale()
  const copy = personalProjectCopy[locale]
  const studio = getStudio(locale)
  const projects = getPersonalProjects(locale)
  const pitch = pitchLinks(pitchRelease)

  return (
    <section id="personal-projects" aria-labelledby="personal-projects-heading" className="personal-projects studio-collection">
      <div className="projects-heading projects-shell">
        <div className="section-label mb-8">
          <span className="num">06</span>
          <span className="name">{copy.label}</span>
        </div>
        <h2 id="personal-projects-heading" className="editorial-h2">{copy.heading}</h2>
        <p className="editorial-lead">{copy.lead}</p>
      </div>

      <div className="projects-body projects-shell">
        <article id={studio.id} className="studio-feature" aria-labelledby="studio-title">
          <div className="studio-identity">
            <span className="studio-identity-meta">{studio.category}</span>
            <Image src={studio.visual.src} alt={studio.name} width={studio.visual.width} height={studio.visual.height} sizes="(max-width: 760px) 70vw, 360px" className="studio-wordmark" />
            <div className="studio-identity-footer"><span>{copy.location}</span><span aria-hidden="true">↗</span></div>
          </div>
          <div className="studio-story">
            <p className="studio-eyebrow">{copy.studioLabel}</p>
            <h3 id="studio-title">{copy.studioHeading}</h3>
            <p className="studio-description">{studio.description}</p>
            <ul className="studio-principles" aria-label={studio.name}>
              {studio.principles.map((principle) => <li key={principle}>{principle}</li>)}
            </ul>
            <div className="studio-links">
              <a href={studio.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.studioVisit}, ${copy.newTab}`}>
                {copy.studioVisit}<span aria-hidden="true">↗</span>
              </a>
              {studio.socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label}, ${copy.newTab}`}>
                  LinkedIn<span aria-hidden="true">↗</span>
                </a>
              ))}
              {pitch && <a href={pitch[locale].href}>{pitch[locale].label}<span aria-hidden="true">↗</span></a>}
            </div>
          </div>
        </article>

        <div className="studio-products-heading">
          <div>
            <p className="editorial-eyebrow">{copy.productsLabel}</p>
            <h3 id="studio-products-title">{copy.productsHeading}</h3>
          </div>
          <p>{copy.productsLead}</p>
        </div>

        <div className="studio-products" role="list" aria-labelledby="studio-products-title">
          {projects.map((project, index) => (
            <article id={project.id} key={project.id} role="listitem" className={`venture-card${project.inDevelopment ? ' venture-card--upcoming' : ''}`} aria-labelledby={`${project.id}-title`}>
              {project.id === 'control-craft' && <span id="lunorive" className="legacy-project-anchor" aria-hidden="true" />}
              <div className="venture-card-top">
                <span className="venture-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="venture-category">{project.inDevelopment ? copy.development : project.category}</span>
                {project.visual && <Image src={project.visual.src} alt="" width={project.visual.width} height={project.visual.height} sizes={project.id === 'control-craft' ? '160px' : '64px'} className={`venture-logo${project.id === 'control-craft' ? ' venture-logo--wide' : ''}`} />}
              </div>
              <div className="venture-content">
                {project.inDevelopment && <p className="editorial-eyebrow">{copy.next}</p>}
                <h4 id={`${project.id}-title`}>{project.name}</h4>
                {project.slogan && <p className="venture-slogan">{project.slogan.join(' ')}</p>}
                <p className="venture-description">{project.description}</p>
              </div>
              <div className="venture-card-bottom">
                {!!project.focus.length && <ul className="venture-focus">{project.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>}
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="venture-link" aria-label={`${copy.visit} ${project.name}, ${copy.newTab}`}>
                    {copy.visit}<span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <a href={`mailto:me@anthonypaquet.com?subject=${encodeURIComponent(copy.contactSubject)}`} className="venture-link">
                    {copy.contact}<span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
