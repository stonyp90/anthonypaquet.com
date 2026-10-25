'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { FaCheck, FaLinkedin, FaFileDownload, FaEnvelope } from 'react-icons/fa'
import { useContent } from '@/components/LocaleProvider'

export default function Hero() {
  const c = useContent()
  return (
    <section className="paper-hero hero-section" id="top" aria-labelledby="hero-heading">
      <div className="hero-layout">
        <div className="hero-copy">
          <span className="status-live hero-availability">{c.ui.hero.badge}</span>
          <p className="hero-name">{c.personalInfo.name}</p>
          <h1 id="hero-heading" className="editorial-display hero-headline">
            {c.ui.hero.headlineLead}{' '}
            <span className="underline-accent">{c.ui.hero.headlineAccent}</span><span className="accent-text">.</span>
          </h1>
          <p className="editorial-lead hero-subtitle">
            {c.ui.hero.subtitleLead}{' '}<strong>{c.ui.hero.subtitleStrong}</strong>{c.ui.hero.subtitleTail}
          </p>
          <div className="hero-trust">
            {c.ui.hero.trustPoints.map((point) => (
              <span key={point}><FaCheck aria-hidden="true" />{point}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a href={c.socialLinks.email} className="btn-primary">
              <FaEnvelope aria-hidden="true" />{c.ui.hero.ctaPrimary}
            </a>
            <a href={c.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <FaLinkedin aria-hidden="true" />{c.ui.hero.ctaLinkedIn}
            </a>
            <a href="/AnthonyPaquet.pdf" download className="btn-ghost">
              <FaFileDownload aria-hidden="true" />{c.ui.hero.ctaResume}
            </a>
          </div>
          <a href="#scaleforged" className="hero-project-link">{c.ui.hero.ctaProjects}<span aria-hidden="true">↘</span></a>
        </div>
        <figure className="hero-portrait">
          <Image
            src={c.personalInfo.photo}
            alt={c.personalInfo.name}
            width={c.personalInfo.photoWidth}
            height={c.personalInfo.photoHeight}
            priority
            className="hero-photo"
            style={{ '--portrait-mask': `url("${c.personalInfo.photoMask}")` } as CSSProperties}
          />
          <figcaption><span>{c.personalInfo.title}</span><span>{c.personalInfo.location}</span></figcaption>
        </figure>
      </div>
    </section>
  )
}
