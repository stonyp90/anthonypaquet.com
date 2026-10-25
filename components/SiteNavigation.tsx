'use client'

import Link from 'next/link'
import { useContent } from '@/components/LocaleProvider'
import { rememberLocale } from '@/lib/localeCookie'

export default function SiteNavigation() {
  const c = useContent()
  const locale = c.ui.locale
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{c.ui.navigation.skip}</a>
      <div className="site-header-inner">
        <a href="#top" className="site-wordmark" aria-label={c.personalInfo.name}>AP<span aria-hidden="true">.</span></a>
        <nav className="site-nav" aria-label={c.ui.navigation.label}>
          <a href="#services">{c.ui.navigation.services}</a>
          <a href="#experience">{c.ui.navigation.experience}</a>
        </nav>
        <div className="locale-switch">
          <span aria-current="true">{locale.label}</span>
          <Link
            href={locale.otherPath}
            aria-label={locale.switchTo}
            onClick={() => rememberLocale(locale.code === 'en' ? 'fr' : 'en')}
          >
            {locale.otherLabel}
          </Link>
        </div>
      </div>
    </header>
  )
}
