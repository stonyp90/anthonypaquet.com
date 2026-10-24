'use client'

import { m } from 'framer-motion'
import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { useContent } from '@/components/LocaleProvider'
import BrandMark from './BrandMark'
import ShareButtons from './ShareButtons'

export default function Footer() {
  const c = useContent()
  const year = new Date().getFullYear()

  const quickLinks = c.ui.footer.quickLinks

  const socials = [
    { href: c.socialLinks.linkedin, icon: FaLinkedin, label: 'LinkedIn' },
    { href: c.socialLinks.github, icon: FaGithub, label: 'GitHub' },
    { href: c.socialLinks.email, icon: FaEnvelope, label: 'Email' },
  ]

  return (
    <footer data-reveal className="site-footer section-reveal bg-paper border-t border-[var(--color-border)]">
      <div className="footer-shell mx-auto max-w-6xl px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-12">
          {/* Brand + positioning */}
          <div className="footer-brand md:col-span-5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-4">
              <BrandMark />
              <span className="brand-name text-lg sm:text-xl">{c.personalInfo.name}</span>
            </div>
            <p className="font-display text-ink text-lg sm:text-xl leading-snug max-w-sm mx-auto sm:mx-0">
              {c.ui.footer.tagline}
            </p>
            <p className="text-ink-soft text-sm sm:text-base leading-relaxed mt-2 max-w-sm mx-auto sm:mx-0">
              {c.ui.footer.blurb}
            </p>
            <a href={c.socialLinks.email} className="btn-primary mt-6 inline-flex">
              <FaEnvelope aria-hidden="true" />
              {c.ui.footer.contactCta}
            </a>
            <div>
              <Link
                href={c.ui.footer.missionHref}
                className="link-arrow mt-4 inline-flex text-sm"
              >
                {c.ui.footer.missionLink}
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="footer-links md:col-span-3 text-center sm:text-left" aria-label="Footer">
            <h3 className="font-mono text-gray-warm text-xs uppercase tracking-[0.18em] mb-4">
              {c.ui.footer.exploreTitle}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-ink-soft hover:text-accent-text transition-[color,transform] duration-200 ease-smooth text-sm sm:text-base inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="footer-connect md:col-span-4 text-center sm:text-left">
            <h3 className="font-mono text-gray-warm text-xs uppercase tracking-[0.18em] mb-4">
              {c.ui.footer.connectTitle}
            </h3>
            <div className="flex gap-5 justify-center sm:justify-start mb-5">
              {socials.map((social) => (
                <m.a
                  key={social.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href}
                  target={social.label !== 'Email' ? '_blank' : undefined}
                  rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="p-1.5 text-ink-soft hover:text-accent-text transition-colors duration-200 ease-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="text-2xl sm:text-[1.6rem]" />
                </m.a>
              ))}
            </div>
            <a
              href={c.socialLinks.email}
              className="text-ink-soft hover:text-accent-text transition-colors duration-200 ease-smooth text-sm sm:text-base inline-block"
            >
              {c.personalInfo.email}
            </a>
            <p className="text-gray-warm text-sm sm:text-base mt-1">{c.personalInfo.location}</p>
          </div>
        </div>

        {/* Share */}
        <div className="footer-share border-t border-[var(--color-border)] pt-8 mt-12 sm:mt-14">
          <ShareButtons />
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom border-t border-[var(--color-border)] pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-mono text-gray-warm text-[10px] sm:text-xs tracking-wide">
            © {year} {c.personalInfo.name}. {c.ui.footer.rights}
          </p>
          <p className="font-mono text-ink-soft text-[10px] sm:text-xs tracking-wide">
            {c.ui.footer.builtWith}
          </p>
          <Link
            href={c.ui.locale.otherPath}
            aria-label={c.ui.locale.switchTo}
            className="font-mono text-ink-soft hover:text-accent-text transition-colors duration-200 text-[10px] sm:text-xs tracking-wide uppercase"
          >
            {c.ui.locale.switchTo}
          </Link>
        </div>
      </div>
    </footer>
  )
}
