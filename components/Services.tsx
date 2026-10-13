'use client'

import { m } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  FaChartLine,
  FaBrain,
  FaShieldAlt,
  FaLock,
  FaRobot,
  FaServer,
  FaCloud,
  FaLayerGroup,
  FaArrowRight,
  FaEnvelope,
} from 'react-icons/fa'
import { useContent } from '@/components/LocaleProvider'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  chart: FaChartLine,
  brain: FaBrain,
  shield: FaShieldAlt,
  lock: FaLock,
  robot: FaRobot,
  recovery: FaServer,
  cloud: FaCloud,
  architecture: FaLayerGroup,
  governance: FaChartLine,
}

type CategoryKey = 'ai' | 'architecture' | 'finops' | 'security'

export default function Services() {
  const c = useContent()
  const ref = useRef(null)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('ai')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const categories: CategoryKey[] = ['ai', 'architecture', 'finops', 'security']

  return (
    <section ref={ref} className="services-section py-20 lg:py-28" id="services">
      <m.div
        variants={containerVariants}
        initial={false}
        animate="visible"
        className="services-shell mx-auto max-w-6xl px-6 lg:px-12"
      >
        {/* Section Header */}
        <m.div variants={itemVariants}>
          <div className="section-label mb-8">
            <span className="num">03</span>
            <span className="name">{c.ui.services.label}</span>
          </div>
          <h2 className="editorial-h2 text-3xl lg:text-4xl mb-5">
            {c.ui.services.headingLead} <span className="accent-text">{c.ui.services.headingAccent}</span> {c.ui.services.headingTail}
          </h2>
          <p className="editorial-lead max-w-2xl mb-12">
            {c.ui.services.lead}
          </p>
        </m.div>

        {/* Category Tabs */}
        <m.div variants={itemVariants} className="service-tabs flex flex-wrap gap-2 sm:gap-3 mb-10">
          {categories.map((category) => {
            const active = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-sm font-mono text-xs sm:text-sm tracking-wide uppercase border transition-[color,border-color,background-color,transform] duration-200 ease-smooth ${
                  active
                    ? 'border-accent text-accent-text bg-accent-bg'
                    : 'border-[var(--color-border)] text-ink-soft hover:text-ink hover:border-border-strong hover:-translate-y-0.5'
                }`}
              >
                {c.ui.services.categories[category].title}
              </button>
            )
          })}
        </m.div>

        {/* Category Description */}
        <m.div
          key={activeCategory}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="service-category-copy mb-10 max-w-2xl"
        >
          <h3 className="editorial-h3 text-xl lg:text-2xl mb-2">
            {c.ui.services.categories[activeCategory].subtitle}
          </h3>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            {c.ui.services.categories[activeCategory].description}
          </p>
        </m.div>

        {/* Service Cards */}
        <m.div
          key={`services-${activeCategory}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="service-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16"
        >
          {c.services[activeCategory].map((service, index) => {
            const IconComponent = iconMap[service.icon] || FaCloud

            return (
              <m.div
                key={service.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="service-card group flex flex-col overflow-hidden rounded-sm bg-paper border border-[var(--color-border)] hover:border-accent transition-[border-color,transform,box-shadow] duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] shadow-[var(--shadow-card)]"
              >
                {/* Accent top rule */}
                <div className="h-[2px] w-full bg-accent" aria-hidden="true" />

                {/* Card Body */}
                <div className="p-6">
                  <IconComponent className="tech-icon text-2xl sm:text-3xl mb-5 text-accent-text" />

                  <h4 className="font-display font-bold text-lg sm:text-xl text-ink mb-3 leading-snug">
                    {service.name}
                  </h4>

                  <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
                    {service.outcome}
                  </p>
                </div>
              </m.div>
            )
          })}
        </m.div>

        {/* Engagement Approach */}
        <m.div variants={itemVariants} className="services-engagement">
          <div className="engagement-card rounded-sm bg-paper border border-[var(--color-border)] p-6 sm:p-8 max-w-3xl shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 ease-smooth hover:border-border-strong hover:shadow-[var(--shadow-card-hover)]">
            <h3 className="editorial-h3 text-xl lg:text-2xl mb-3">
              {c.ui.services.engagementTitle}
            </h3>
            <p className="text-ink-soft text-sm sm:text-base leading-relaxed mb-5">
              {c.ui.services.engagementBodyLead}{' '}
              <strong className="text-ink font-semibold">{c.ui.services.engagementBodyStrong}</strong>{c.ui.services.engagementBodyTail}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {c.ui.services.engagementTags.map((tag) => (
                <span key={tag} className="tech-tag">{tag}</span>
              ))}
            </div>

            <div className="stat-block mb-6">
              <p className="text-sm text-ink-soft leading-relaxed">
                <strong className="text-ink font-semibold">{c.ui.services.provenResultsStrong}</strong>{c.ui.services.provenResultsTail}
              </p>
            </div>

            <div className="pt-5 border-t border-[var(--color-border)]">
              <a href={c.socialLinks.email} className="btn-primary">
                <FaEnvelope aria-hidden="true" />
                <span>{c.ui.services.contactCta}</span>
                <FaArrowRight aria-hidden="true" />
              </a>
              <p className="text-xs text-gray-warm mt-3">
                {c.ui.services.contactHint}
              </p>
            </div>
          </div>
        </m.div>
      </m.div>
    </section>
  )
}
