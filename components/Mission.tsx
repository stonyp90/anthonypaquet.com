import Link from 'next/link'
import BrandMark from '@/components/BrandMark'
import {
  MISSION_DATE,
  MISSION_ORIGIN,
  MISSION_QUOTE_EN,
  MISSION_URLS,
  missionCopy,
  type MissionLocale,
} from '@/lib/content/mission'

/* The statement is the page's whole reason to exist, so it ships as a
   machine-readable Quotation beside the WebPage node: an answer engine can
   cite the exact sentence and the person it belongs to. */
function schemas(locale: MissionLocale) {
  const c = missionCopy[locale]
  const url = MISSION_URLS[locale]
  const pageId = `${url}#page`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageId,
      url,
      name: c.metaTitle,
      description: c.metaDescription,
      inLanguage: ['en-CA', 'fr-CA', 'zh-CN'],
      isPartOf: { '@id': `${MISSION_ORIGIN}/#website` },
      about: { '@id': `${MISSION_ORIGIN}/#person` },
      mainEntity: { '@id': `${MISSION_ORIGIN}/#person` },
      datePublished: MISSION_DATE,
      dateModified: MISSION_DATE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Quotation',
      '@id': `${url}#quote`,
      text: MISSION_QUOTE_EN,
      inLanguage: 'en-CA',
      spokenByCharacter: { '@id': `${MISSION_ORIGIN}/#person` },
      datePublished: MISSION_DATE,
      isPartOf: { '@id': pageId },
    },
  ]
}

export default function Mission({ locale }: { locale: MissionLocale }) {
  const c = missionCopy[locale]
  const year = new Date().getFullYear()

  return (
    <div className="mission-page min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas(locale)) }}
      />

      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href={c.homeHref} className="flex items-center gap-2.5" aria-label="Anthony Paquet">
            <BrandMark size={30} />
            <span className="brand-name text-base sm:text-lg">Anthony Paquet</span>
          </Link>
          <nav aria-label={c.languageLabel} className="locale-switch">
            {c.switches.map((entry) => (
              <Link
                key={entry.code}
                href={entry.href}
                hrefLang={entry.code}
                lang={entry.code}
                aria-current={entry.code === c.code ? 'page' : undefined}
                className={
                  entry.code === c.code
                    ? 'text-accent-text font-semibold px-1'
                    : 'text-ink-soft hover:text-accent-text transition-colors px-1'
                }
              >
                {entry.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
        <p className="editorial-eyebrow">{c.eyebrow}</p>
        <h1 className="editorial-display mt-4 text-4xl sm:text-6xl">{c.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{c.lead}</p>

        <figure id="quote" className="pull-quote mt-14">
          <p className="editorial-eyebrow not-italic">{c.quoteLabel}</p>
          <blockquote className="mt-5 text-2xl leading-snug sm:text-3xl">
            {c.quote}
          </blockquote>
          <figcaption className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-gray-warm not-italic">
            {c.quoteAttribution}
          </figcaption>

          {c.translation ? (
            <div className="mt-8 border-t border-[var(--color-border)] pt-6 not-italic">
              <p className="editorial-eyebrow">{c.translationLabel}</p>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{c.translation}</p>
            </div>
          ) : null}
        </figure>

        <section className="mt-16">
          <h2 className="editorial-h2 text-2xl sm:text-3xl">{c.scopeTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{c.scopeBody}</p>
        </section>

        <section className="mt-14">
          <h2 className="editorial-h2 text-2xl sm:text-3xl">{c.principlesTitle}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {c.principles.map((principle, index) => (
              <li key={principle.title} className="pillar">
                <span className="num">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-lg">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{principle.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <a href={c.emailHref} className="btn-primary inline-flex">
            {c.emailCta}
          </a>
          <Link href={c.homeHref} className="link-arrow">
            {c.backHome}
          </Link>
        </div>
      </main>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-3xl px-6 py-8 font-mono text-xs tracking-wide text-gray-warm">
          © {year} Anthony Paquet
        </div>
      </footer>
    </div>
  )
}
