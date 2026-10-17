// Living style guide for the Maison design system. This component and
// design-system/maison-guide.css are identical in anthonypaquet.com and
// scaleforged.io; each site renders it at /brand (and its other locale) with
// its own brand voice. Components shown are the shared editorial classes each
// site's globals.css implements.
import '../design-system/maison-guide.css'
import {
  MAISON_VERSION,
  contrastRatio,
  maisonColors,
  maisonMotion,
  maisonRadii,
  maisonSpace,
  type MaisonBrand,
  type MaisonLocale,
} from '../design-system/maison'

type Props = {
  locale: MaisonLocale
  brand: MaisonBrand
  /** Home page in the current locale. */
  homeHref: string
  /** This guide in the other locale. */
  altLocaleHref: string
  /** The other brand's guide, for the voice it cannot render with its own fonts. */
  siblingGuideHref: string
  /** Render the guide's own top bar (for sites without a global header). */
  standalone?: boolean
}

const copy = {
  fr: {
    skip: 'Aller au contenu',
    home: 'Accueil',
    otherLocale: 'English',
    otherLocaleLang: 'en',
    eyebrow: 'Système de design',
    title: 'Maison',
    lead: 'Une maison, deux voix. Anthony Paquet et ScaleForge partagent la même palette, la même grille, les mêmes formes et le même mouvement. Seule la voix du titre change : une serif d’auteur pour la marque personnelle, une sans technique pour le studio.',
    version: 'Version',
    toc: 'Sommaire',
    sections: { voices: 'Voix', color: 'Couleur', type: 'Typographie', space: 'Espace et formes', components: 'Composants', motion: 'Mouvement', writing: 'Rédaction' },
    voices: {
      intro: 'Les jetons sémantiques sont identiques sur les deux sites. L’attribut data-brand sur <html> choisit la voix.',
      ap: { name: 'Anthony Paquet', role: 'Marque personnelle · anthonypaquet.com', sample: 'Architecte IA et cloud.' },
      sf: { name: 'ScaleForge', role: 'Studio venture · scaleforged.io', sample: 'Bâtir des entreprises IA au Québec.' },
      sibling: 'La voix serif d’Anthony Paquet est présentée dans son propre guide.',
      siblingLink: 'Voir le guide d’Anthony Paquet',
    },
    color: {
      intro: 'Papier crème, encre chaude, laiton. Le laiton reste décoratif sur fond clair. Tout texte accentué utilise le laiton profond.',
      contrast: 'Contraste sur crème',
      decorative: 'décoratif',
      role: 'Rôle',
    },
    type: {
      intro: 'Inter pour le texte, une voix de titre par marque, une monospace pour les surtitres et les données.',
      display: 'Titre d’affichage',
      h2: 'Titre de section',
      h3: 'Sous-titre',
      lead: 'Chapeau : une phrase qui situe la section avant le détail.',
      body: 'Texte courant. Une mesure d’environ 65 caractères, une interligne de 1,6, des phrases complètes et sans jargon.',
      eyebrow: 'Surtitre · monospace',
      displaySample: 'Bâtir sans retirer d’emplois',
      h2Sample: 'Le modèle du studio',
      h3Sample: 'Un socle commun',
    },
    space: { intro: 'Des espacements fluides qui respirent du téléphone au grand écran.', radius: 'Rayons' },
    components: {
      intro: 'Classes partagées. Le focus clavier est toujours visible : contour de 2 px en laiton profond.',
      buttons: 'Boutons et liens',
      primary: 'Action principale',
      ghost: 'Action secondaire',
      arrow: 'Lien fléché',
      inline: 'lien en ligne',
      inlineBefore: 'Un',
      inlineAfter: 'dans un paragraphe.',
      focusDemo: 'État focus',
      status: 'Statuts',
      live: 'En ligne',
      beta: 'Bêta',
      tags: 'Étiquettes',
      stat: 'Bloc chiffré',
      statValue: '7',
      statLabel: 'Programmes (exemple)',
      pillar: 'Pilier',
      pillarNum: '01 · Pilier',
      pillarTitle: 'Un socle commun',
      pillarBody: 'Chaque entreprise démarre sur la même infrastructure, les mêmes pratiques et la même équipe.',
      highlight: 'Encadré',
      highlightPin: 'À retenir',
      highlightBody: 'Les chiffres illustratifs sont toujours identifiés comme tels.',
      field: 'Champ',
      fieldLabel: 'Courriel',
      fieldPlaceholder: 'vous@exemple.ca',
      quote: 'Citation',
      quoteBody: 'Bâtir des entreprises sans retirer d’emplois.',
      list: 'Liste',
      listItems: ['Parité FR et EN', 'Contraste AA ou mieux', 'Mouvement réduit respecté'],
    },
    motion: {
      intro: 'Le mouvement accompagne la lecture, jamais l’inverse. Avec « réduire les animations », chaque durée et chaque distance tombe à zéro.',
      token: 'Jeton',
      value: 'Valeur',
      use: 'Usage',
    },
    writing: {
      intro: 'Une voix directe, humaine et précise, dans les deux langues.',
      rules: [
        'Parité FR et EN à chaque changement. Le français est rédigé, pas traduit.',
        'Aucun chiffre ni résultat inventé. Tout chiffre illustratif est identifié comme tel.',
        'Phrases complètes, verbes actifs, aucun jargon gratuit.',
        'Le point final en laiton signe les titres principaux.',
        'Ni point-virgule ni tiret cadratin dans le texte affiché : deux phrases valent mieux qu’une.',
      ],
    },
  },
  en: {
    skip: 'Skip to content',
    home: 'Home',
    otherLocale: 'Français',
    otherLocaleLang: 'fr',
    eyebrow: 'Design system',
    title: 'Maison',
    lead: 'One house, two voices. Anthony Paquet and ScaleForge share one palette, one grid, one set of shapes and one motion language. Only the headline voice changes: an authored serif for the personal brand, a technical sans for the studio.',
    version: 'Version',
    toc: 'Contents',
    sections: { voices: 'Voices', color: 'Colour', type: 'Type', space: 'Space and shape', components: 'Components', motion: 'Motion', writing: 'Writing' },
    voices: {
      intro: 'Semantic tokens are identical on both sites. The data-brand attribute on <html> picks the voice.',
      ap: { name: 'Anthony Paquet', role: 'Personal brand · anthonypaquet.com', sample: 'AI and cloud architect.' },
      sf: { name: 'ScaleForge', role: 'Venture studio · scaleforged.io', sample: 'Building AI companies in Quebec.' },
      sibling: 'The Anthony Paquet serif voice is shown in its own guide.',
      siblingLink: 'See the Anthony Paquet guide',
    },
    color: {
      intro: 'Cream paper, warm ink, brass. Brass stays decorative on light surfaces. Any accent text uses deep brass.',
      contrast: 'Contrast on cream',
      decorative: 'decorative',
      role: 'Role',
    },
    type: {
      intro: 'Inter for reading, one headline voice per brand, a monospace for eyebrows and data.',
      display: 'Display',
      h2: 'Section heading',
      h3: 'Subheading',
      lead: 'Lead: one sentence that frames the section before the detail.',
      body: 'Body copy. A measure of about 65 characters, 1.6 line height, full sentences and no jargon.',
      eyebrow: 'Eyebrow · monospace',
      displaySample: 'Building without removing jobs',
      h2Sample: 'The studio model',
      h3Sample: 'One shared foundation',
    },
    space: { intro: 'Fluid spacing that breathes from phone to wide screen.', radius: 'Radii' },
    components: {
      intro: 'Shared classes. Keyboard focus is always visible: a 2 px deep-brass outline.',
      buttons: 'Buttons and links',
      primary: 'Primary action',
      ghost: 'Secondary action',
      arrow: 'Arrow link',
      inline: 'inline link',
      inlineBefore: 'An',
      inlineAfter: 'inside a paragraph.',
      focusDemo: 'Focus state',
      status: 'Status',
      live: 'Live',
      beta: 'Beta',
      tags: 'Tags',
      stat: 'Stat block',
      statValue: '7',
      statLabel: 'Programs (example)',
      pillar: 'Pillar',
      pillarNum: '01 · Pillar',
      pillarTitle: 'One shared foundation',
      pillarBody: 'Every company starts on the same infrastructure, the same practices and the same team.',
      highlight: 'Highlight',
      highlightPin: 'Remember',
      highlightBody: 'Illustrative figures are always labelled as illustrative.',
      field: 'Field',
      fieldLabel: 'Email',
      fieldPlaceholder: 'you@example.com',
      quote: 'Pull quote',
      quoteBody: 'Building companies without removing jobs.',
      list: 'List',
      listItems: ['FR and EN parity', 'AA contrast or better', 'Reduced motion respected'],
    },
    motion: {
      intro: 'Motion serves reading, never the reverse. With “reduce motion” on, every duration and distance drops to zero.',
      token: 'Token',
      value: 'Value',
      use: 'Use',
    },
    writing: {
      intro: 'A direct, human and precise voice, in both languages.',
      rules: [
        'FR and EN parity on every change. French is written, not translated.',
        'No invented figures or outcomes. Illustrative numbers are labelled as such.',
        'Full sentences, active verbs, no needless jargon.',
        'The brass full stop signs primary headlines.',
        'No semicolons or em dashes in displayed copy: two sentences beat one.',
      ],
    },
  },
} as const

const sectionIds = ['voices', 'color', 'type', 'space', 'components', 'motion', 'writing'] as const
const cream = maisonColors.find((c) => c.token === '--maison-cream')!.hex

export default function MaisonGuide({ locale, brand, homeHref, altLocaleHref, siblingGuideHref, standalone = false }: Props) {
  const t = copy[locale]
  const showsBothVoices = brand === 'anthony-paquet'

  return (
    <div className="mg" data-brand={brand}>
      {standalone && (
        <>
          <a className="mg-skip" href="#mg-main">{t.skip}</a>
          <header className="mg-bar">
            <a href={homeHref} className="mg-bar-home">{t.home}</a>
            <a href={altLocaleHref} hrefLang={t.otherLocaleLang} lang={t.otherLocaleLang} className="mg-bar-locale">{t.otherLocale}</a>
          </header>
        </>
      )}

      <div id="mg-main" className="mg-inner" tabIndex={-1}>
        <header className="mg-hero">
          <div className="section-label">
            <span className="num">{MAISON_VERSION}</span>
            <span className="name">{t.eyebrow}</span>
          </div>
          <h1 className="mg-title">{t.title}<span className="accent-text">.</span></h1>
          <p className="mg-lead">{t.lead}</p>
          <p className="mg-meta">{t.version} {MAISON_VERSION} · design-system/maison.css</p>
          {!standalone && (
            <p className="mg-meta"><a href={altLocaleHref} hrefLang={t.otherLocaleLang} lang={t.otherLocaleLang} className="inline-link">{t.otherLocale}</a></p>
          )}
          <nav aria-label={t.toc} className="mg-toc">
            {sectionIds.map((id) => <a key={id} href={`#mg-${id}`}>{t.sections[id]}</a>)}
          </nav>
        </header>

        <section id="mg-voices" className="mg-section" aria-labelledby="mg-voices-h">
          <h2 id="mg-voices-h" className="mg-h2">{t.sections.voices}</h2>
          <p className="mg-intro">{t.voices.intro}</p>
          <div className="mg-voices">
            {showsBothVoices && (
              <figure className="mg-voice" data-brand="anthony-paquet">
                <p className="mg-voice-sample">{t.voices.ap.sample}</p>
                <figcaption><strong>{t.voices.ap.name}</strong><span>{t.voices.ap.role}</span><code>data-brand=&quot;anthony-paquet&quot;</code></figcaption>
              </figure>
            )}
            <figure className="mg-voice" data-brand="scaleforged">
              <p className="mg-voice-sample">{t.voices.sf.sample}</p>
              <figcaption><strong>{t.voices.sf.name}</strong><span>{t.voices.sf.role}</span><code>data-brand=&quot;scaleforged&quot;</code></figcaption>
            </figure>
            {!showsBothVoices && (
              <div className="mg-voice mg-voice--link">
                <p>{t.voices.sibling}</p>
                <a href={siblingGuideHref} className="link-arrow">{t.voices.siblingLink} <span aria-hidden="true">→</span></a>
              </div>
            )}
          </div>
        </section>

        <section id="mg-color" className="mg-section" aria-labelledby="mg-color-h">
          <h2 id="mg-color-h" className="mg-h2">{t.sections.color}</h2>
          <p className="mg-intro">{t.color.intro}</p>
          <ul className="mg-swatches">
            {maisonColors.map((c) => {
              const ratio = contrastRatio(c.hex, cream)
              return (
                <li key={c.token} className="mg-swatch">
                  <span className="mg-chip" style={{ background: `var(${c.token})` }} aria-hidden="true" />
                  <span className="mg-swatch-text">
                    <code>{c.role}</code>
                    <span className="mg-swatch-use">{c.use[locale]}</span>
                    <span className="mg-swatch-meta">
                      {c.hex}{c.token === '--maison-cream' ? '' : ` · ${ratio.toFixed(1)}:1`}
                      {c.token === '--maison-brass' ? ` (${t.color.decorative})` : ''}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section id="mg-type" className="mg-section" aria-labelledby="mg-type-h">
          <h2 id="mg-type-h" className="mg-h2">{t.sections.type}</h2>
          <p className="mg-intro">{t.type.intro}</p>
          <dl className="mg-type">
            <div><dt>{t.type.display} · <code>--text-display</code></dt><dd className="mg-type-display">{t.type.displaySample}<span className="accent-text">.</span></dd></div>
            <div><dt>{t.type.h2} · <code>--text-h2</code></dt><dd className="mg-type-h2">{t.type.h2Sample}</dd></div>
            <div><dt>{t.type.h3} · <code>--text-h3</code></dt><dd className="mg-type-h3">{t.type.h3Sample}</dd></div>
            <div><dt><code>--text-lead</code></dt><dd className="mg-type-lead">{t.type.lead}</dd></div>
            <div><dt><code>--text-body</code></dt><dd>{t.type.body}</dd></div>
            <div><dt><code>--text-eyebrow</code></dt><dd><span className="editorial-eyebrow">{t.type.eyebrow}</span></dd></div>
          </dl>
        </section>

        <section id="mg-space" className="mg-section" aria-labelledby="mg-space-h">
          <h2 id="mg-space-h" className="mg-h2">{t.sections.space}</h2>
          <p className="mg-intro">{t.space.intro}</p>
          <ul className="mg-space">
            {maisonSpace.map((token) => (
              <li key={token}><code>{token}</code><span className="mg-space-bar" style={{ width: `var(${token})` }} aria-hidden="true" /></li>
            ))}
          </ul>
          <h3 className="mg-h3">{t.space.radius}</h3>
          <ul className="mg-radii">
            {maisonRadii.map((r) => (
              <li key={r.token}><span className="mg-radius" style={{ borderRadius: `var(${r.token})` }} aria-hidden="true" /><code>{r.token}</code><span>{r.use[locale]}</span></li>
            ))}
          </ul>
        </section>

        <section id="mg-components" className="mg-section" aria-labelledby="mg-components-h">
          <h2 id="mg-components-h" className="mg-h2">{t.sections.components}</h2>
          <p className="mg-intro">{t.components.intro}</p>
          <div className="mg-grid">
            <div className="mg-card">
              <h3 className="mg-h3">{t.components.buttons}</h3>
              <div className="mg-row">
                <button type="button" className="btn-primary">{t.components.primary}</button>
                <button type="button" className="btn-ghost">{t.components.ghost}</button>
              </div>
              <div className="mg-row">
                <a href="#mg-components" className="link-arrow">{t.components.arrow} <span aria-hidden="true">→</span></a>
              </div>
              <p>{t.components.inlineBefore} <a href="#mg-components" className="inline-link">{t.components.inline}</a> {t.components.inlineAfter}</p>
              <div className="mg-row"><span className="mg-focus-demo">{t.components.focusDemo}</span></div>
            </div>
            <div className="mg-card">
              <h3 className="mg-h3">{t.components.status}</h3>
              <div className="mg-row">
                <span className="status-live">{t.components.live}</span>
                <span className="status-beta">{t.components.beta}</span>
              </div>
              <h3 className="mg-h3">{t.components.tags}</h3>
              <div className="mg-row">
                <span className="tech-tag">Next.js</span>
                <span className="tech-tag">Cloudflare</span>
                <span className="tech-tag">AI</span>
              </div>
              <h3 className="mg-h3">{t.components.stat}</h3>
              <div className="stat-block"><div className="v">{t.components.statValue}</div><div className="l">{t.components.statLabel}</div></div>
            </div>
            <div className="mg-card">
              <h3 className="mg-h3">{t.components.pillar}</h3>
              <div className="pillar">
                <span className="num">{t.components.pillarNum}</span>
                <h4 className="mg-pillar-title">{t.components.pillarTitle}</h4>
                <p>{t.components.pillarBody}</p>
              </div>
            </div>
            <div className="mg-card">
              <h3 className="mg-h3">{t.components.highlight}</h3>
              <div className="editorial-highlight"><span className="pin">{t.components.highlightPin}</span><p>{t.components.highlightBody}</p></div>
              <h3 className="mg-h3">{t.components.quote}</h3>
              <blockquote className="pull-quote">{t.components.quoteBody}</blockquote>
            </div>
            <div className="mg-card">
              <h3 className="mg-h3">{t.components.field}</h3>
              <label className="mg-label" htmlFor={`mg-field-${locale}`}>{t.components.fieldLabel}</label>
              <input id={`mg-field-${locale}`} type="email" className="contact-field" placeholder={t.components.fieldPlaceholder} autoComplete="off" />
              <h3 className="mg-h3">{t.components.list}</h3>
              <ul className="clean-list">{t.components.listItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section id="mg-motion" className="mg-section" aria-labelledby="mg-motion-h">
          <h2 id="mg-motion-h" className="mg-h2">{t.sections.motion}</h2>
          <p className="mg-intro">{t.motion.intro}</p>
          <div className="mg-table-wrap">
            <table className="mg-table">
              <thead><tr><th scope="col">{t.motion.token}</th><th scope="col">{t.motion.value}</th><th scope="col">{t.motion.use}</th></tr></thead>
              <tbody>
                {maisonMotion.map((m) => (
                  <tr key={m.token}><td><code>{m.token}</code></td><td><code>{m.value}</code></td><td>{m.use[locale]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mg-motion-demo" aria-hidden="true"><span /></div>
        </section>

        <section id="mg-writing" className="mg-section" aria-labelledby="mg-writing-h">
          <h2 id="mg-writing-h" className="mg-h2">{t.sections.writing}</h2>
          <p className="mg-intro">{t.writing.intro}</p>
          <ul className="clean-list">{t.writing.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
        </section>
      </div>
    </div>
  )
}
