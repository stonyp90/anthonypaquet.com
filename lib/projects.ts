import type { Locale } from '@/lib/content'

export type ProjectSocialLink = {
  label: string
  /** Shipped only after the social audit verified ownership of the profile. */
  href: `https://${string}`
}

export type PersonalProject = {
  id: 'gonota' | 'tablix' | 'ursly' | 'scaleforged' | 'lunorive'
  name: string
  /** Official destination. Absent until the product has a confirmed public URL. */
  url?: `https://${string}`
  /** Verified company social profiles. Only audited, owner-administered pages ship. */
  socialLinks?: readonly ProjectSocialLink[]
  category: string
  description: string
  slogan?: readonly string[]
  visual: {
    src: string
    width: number
    height: number
  }
}

type ProjectSectionCopy = {
  label: string
  heading: string
  lead: string
  visit: string
  newTab: string
}

export const personalProjectCopy: Record<Locale, ProjectSectionCopy> = {
  en: {
    label: 'Personal projects',
    heading: 'Ideas I build into products.',
    lead: 'Independent projects at the intersection of useful software, human interaction, and entrepreneurship.',
    visit: 'Explore the project',
    newTab: 'opens in a new tab',
  },
  fr: {
    label: 'Projets personnels',
    heading: 'Des idées qui deviennent des produits.',
    lead: 'Des projets indépendants à la croisée du logiciel utile, de l’interaction humaine et de l’entrepreneuriat.',
    visit: 'Découvrir le projet',
    newTab: 's’ouvre dans un nouvel onglet',
  },
}

/* Each card carries that product's own canonical mark, copied byte for byte from
   the product repository at a pinned commit. See
   docs/project-brand-assets-2026-10-02.json and scripts/sync-product-logos.mjs. */
const visuals = {
  gonota: { src: '/images/logos/nota-mark.png', width: 512, height: 512 },
  tablix: { src: '/images/logos/tablix-mark.svg', width: 512, height: 512 },
  ursly: { src: '/images/logos/ursly-mark.svg', width: 1024, height: 1024 },
  scaleforged: { src: '/images/logos/scaleforge-mark.svg', width: 106, height: 210 },
  lunorive: { src: '/images/logos/lunorive-mark.png', width: 256, height: 256 },
} as const

/** Independent product data; presentation and external navigation stay in adapters. */
const projects: Record<Locale, readonly PersonalProject[]> = {
  en: [
    {
      id: 'gonota', name: 'GoNota', url: 'https://gonota.ca',
      category: 'Notarial technology',
      description: 'A public calendar where clients across Québec post their notarial act, date and price, and notaries pick the requests that fit.',
      visual: visuals.gonota,
    },
    {
      id: 'tablix', name: 'Tablix', url: 'https://tablix.ca',
      category: 'Document intelligence',
      description: 'Document intelligence for structuring Québec legal searches into useful, exportable data.',
      visual: visuals.tablix,
    },
    {
      id: 'ursly', name: 'Ursly', url: 'https://ursly.io',
      category: 'Human and technology interface',
      description: 'Exploring a new interface between people and technology through voice, movement, and our senses.',
      slogan: ['Your senses.', 'Your data.', 'Your choice.'],
      visual: visuals.ursly,
    },
    {
      id: 'scaleforged', name: 'ScaleForge', url: 'https://scaleforged.io',
      socialLinks: [{ label: 'ScaleForge on LinkedIn', href: 'https://www.linkedin.com/company/scaleforged/' }],
      category: 'Independent venture studio',
      description: 'An independent studio building vertical SaaS platforms on a shared technical foundation.',
      visual: visuals.scaleforged,
    },
    {
      id: 'lunorive', name: 'Lunorive',
      category: 'Art prints made by the agent loop',
      description: 'Framed art prints of the places people love, from bridges and mountains to lakes and coastlines, drawn from real data. My agent loop creates the shop without human interaction, with checkout hosted by Stripe.',
      slogan: ['Keep the world close.'],
      visual: visuals.lunorive,
    },
  ],
  fr: [
    {
      id: 'gonota', name: 'GoNota', url: 'https://gonota.ca',
      category: 'Technologie notariale',
      description: 'Un calendrier public où les clients de partout au Québec publient leur acte notarié, leur date et leur prix, et où les notaires choisissent les demandes qui leur conviennent.',
      visual: visuals.gonota,
    },
    {
      id: 'tablix', name: 'Tablix', url: 'https://tablix.ca',
      category: 'Intelligence documentaire',
      description: 'L’intelligence documentaire pour transformer les recherches juridiques québécoises en données structurées et exportables.',
      visual: visuals.tablix,
    },
    {
      id: 'ursly', name: 'Ursly', url: 'https://ursly.io',
      category: 'Interface entre l’humain et la technologie',
      description: 'Une nouvelle interface entre l’humain et la technologie, explorée à travers la voix, le mouvement et nos sens.',
      slogan: ['Vos sens.', 'Vos données.', 'Votre choix.'],
      visual: visuals.ursly,
    },
    {
      id: 'scaleforged', name: 'ScaleForge', url: 'https://scaleforged.io',
      socialLinks: [{ label: 'ScaleForge sur LinkedIn', href: 'https://www.linkedin.com/company/scaleforged/' }],
      category: 'Studio venture indépendant',
      description: 'Un studio indépendant qui construit des plateformes SaaS verticales sur un socle technique commun.',
      visual: visuals.scaleforged,
    },
    {
      id: 'lunorive', name: 'Lunorive',
      category: 'Œuvres d’art créées par la boucle d’agents',
      description: 'Des œuvres encadrées des lieux qu’on aime, des ponts et des montagnes aux lacs et aux côtes, tracées à partir de vraies données. Ma boucle d’agents crée la boutique sans intervention humaine, avec un paiement hébergé par Stripe.',
      slogan: ['Le monde, près de vous.'],
      visual: visuals.lunorive,
    },
  ],
}

export function getPersonalProjects(locale: Locale): readonly PersonalProject[] {
  return projects[locale]
}
