import type { Locale } from '@/lib/content'

export type PersonalProject = {
  id: 'gonota' | 'tablix' | 'ursly' | 'scaleforged'
  name: string
  url: `https://${string}`
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

const visuals = {
  gonota: { src: '/images/logos/gonota.svg', width: 204, height: 96 },
  tablix: { src: '/images/logos/tablix-personal.svg', width: 330, height: 330 },
  ursly: { src: '/images/logos/ursly-mark.svg', width: 240, height: 240 },
  scaleforged: { src: '/images/logos/scaleforged.svg', width: 24, height: 24 },
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
      id: 'scaleforged', name: 'ScaleForged', url: 'https://scaleforged.io',
      category: 'Independent venture studio',
      description: 'An independent studio building vertical SaaS platforms on a shared technical foundation.',
      visual: visuals.scaleforged,
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
      id: 'scaleforged', name: 'ScaleForged', url: 'https://scaleforged.io',
      category: 'Studio venture indépendant',
      description: 'Un studio indépendant qui construit des plateformes SaaS verticales sur un socle technique commun.',
      visual: visuals.scaleforged,
    },
  ],
}

export function getPersonalProjects(locale: Locale): readonly PersonalProject[] {
  return projects[locale]
}
