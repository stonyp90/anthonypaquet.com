// Maison design system: the token catalogue the living style guides render.
// Identical in anthonypaquet.com and scaleforged.io. Hex values mirror
// design-system/maison.css; tests/**/maison.test.mjs fails if they drift.

export type MaisonLocale = 'fr' | 'en'
export type MaisonBrand = 'anthony-paquet' | 'scaleforged'
type Copy = Record<MaisonLocale, string>

export const MAISON_VERSION = '1.1.0'

export type MaisonColor = { token: string; role: string; hex: string; use: Copy }

export const maisonColors: MaisonColor[] = [
  { token: '--maison-cream', role: '--color-cream', hex: '#f6efe0', use: { fr: 'Fond de page', en: 'Page background' } },
  { token: '--maison-paper', role: '--color-paper', hex: '#fffcf5', use: { fr: 'Surfaces surélevées, cartes', en: 'Raised surfaces, cards' } },
  { token: '--maison-paper-soft', role: '--color-paper-soft', hex: '#faf3e6', use: { fr: 'Rangées alternées, aplats discrets', en: 'Zebra rows, quiet fills' } },
  { token: '--maison-sand', role: '--color-section-alt', hex: '#f1e8d4', use: { fr: 'Sections alternées', en: 'Alternating sections' } },
  { token: '--maison-ink', role: '--color-ink', hex: '#1b1714', use: { fr: 'Texte principal, sections inversées', en: 'Primary text, inverse sections' } },
  { token: '--maison-ink-soft', role: '--color-ink-soft', hex: '#463f38', use: { fr: 'Texte secondaire', en: 'Secondary text' } },
  { token: '--maison-stone', role: '--color-gray', hex: '#6a615b', use: { fr: 'Texte atténué, notes', en: 'Muted text, notes' } },
  { token: '--maison-brass', role: '--color-accent', hex: '#d4831f', use: { fr: 'Accent décoratif : filets, points, aplats', en: 'Decorative accent: rules, dots, fills' } },
  { token: '--maison-brass-soft', role: '--color-accent-soft', hex: '#edb265', use: { fr: 'Accent sur fond encre, ombres décalées', en: 'Accent on ink, offset shadows' } },
  { token: '--maison-brass-wash', role: '--color-accent-bg', hex: '#fcf3e0', use: { fr: 'Encadrés mis en valeur', en: 'Highlighted panels' } },
  { token: '--maison-brass-deep', role: '--color-accent-text', hex: '#8f5310', use: { fr: 'Liens, icônes, texte accentué, focus', en: 'Links, icons, accent text, focus' } },
  { token: '--maison-line', role: '--color-border', hex: '#e7dcc6', use: { fr: 'Filets et séparateurs', en: 'Hairlines and dividers' } },
  { token: '--maison-line-strong', role: '--color-border-strong', hex: '#c4b394', use: { fr: 'Bordures appuyées, texte atténué sur encre', en: 'Strong borders, muted text on ink' } },
  { token: '--maison-moss', role: '--color-live', hex: '#246626', use: { fr: 'Statut : en ligne', en: 'Status: live' } },
  { token: '--maison-moss-wash', role: '--color-live-bg', hex: '#e7f1e6', use: { fr: 'Fond du statut en ligne', en: 'Live status background' } },
  { token: '--maison-rust', role: '--color-beta', hex: '#92440f', use: { fr: 'Statut : bêta, en construction', en: 'Status: beta, in build' } },
  { token: '--maison-rust-wash', role: '--color-beta-bg', hex: '#fdf2ea', use: { fr: 'Fond du statut bêta', en: 'Beta status background' } },
]

export const maisonSpace = ['--space-xs', '--space-sm', '--space-md', '--space-lg', '--space-xl', '--space-2xl'] as const

export const maisonRadii = [
  { token: '--radius-sharp', use: { fr: 'Boutons, champs, étiquettes', en: 'Buttons, fields, tags' } },
  { token: '--radius-control', use: { fr: 'Contrôles compacts', en: 'Compact controls' } },
  { token: '--radius-panel', use: { fr: 'Panneaux, médias', en: 'Panels, media' } },
  { token: '--radius-pill', use: { fr: 'Pastilles de statut', en: 'Status pills' } },
] satisfies { token: string; use: Copy }[]

export const maisonMotion = [
  { token: '--ease-editorial', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: { fr: 'Entrées de contenu', en: 'Content entrances' } },
  { token: '--ease-smooth', value: 'cubic-bezier(0.4, 0, 0.2, 1)', use: { fr: 'Changements d’état', en: 'State changes' } },
  { token: '--duration-fast', value: '200ms', use: { fr: 'Survol, soulignés', en: 'Hover, underlines' } },
  { token: '--duration-base', value: '250ms', use: { fr: 'Boutons, cartes', en: 'Buttons, cards' } },
  { token: '--motion-duration', value: '650ms', use: { fr: 'Révélation d’un bloc', en: 'Block reveal' } },
  { token: '--motion-section-duration', value: '820ms', use: { fr: 'Révélation d’une section', en: 'Section reveal' } },
] satisfies { token: string; value: string; use: Copy }[]

/** WCAG 2.x contrast ratio between two #rrggbb colours. */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
