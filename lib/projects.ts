import type { Locale } from '@/lib/content'

export type ProjectVisual = { src: string; width: number; height: number }
export type ProjectSocialLink = { label: string; href: `https://${string}` }

export type PersonalProject = {
  id: 'gonota' | 'tablix' | 'control-craft' | 'ursly' | 'offerduel'
  name: string
  category: string
  description: string
  focus: readonly string[]
  /** Only confirmed public destinations and canonical brand files are published. */
  url?: `https://${string}`
  visual?: ProjectVisual
  slogan?: readonly string[]
  inDevelopment?: boolean
}

export type Studio = {
  id: 'scaleforged'
  name: string
  url: `https://${string}`
  category: string
  description: string
  principles: readonly string[]
  signature: string
  visual: ProjectVisual
  socialLinks: readonly ProjectSocialLink[]
}

export const personalProjectCopy = {
  en: {
    productsLabel: 'Projects I’m building',
    visit: 'Explore the product',
    newTab: 'opens in a new tab',
    development: 'In development',
    contact: 'Talk about this project',
    contactSubject: 'Let’s talk about OfferDuel',
  },
  fr: {
    productsLabel: 'Les projets que je développe',
    visit: 'Découvrir le produit',
    newTab: 's’ouvre dans un nouvel onglet',
    development: 'En développement',
    contact: 'Parlons de ce projet',
    contactSubject: 'Parlons d’OfferDuel',
  },
} satisfies Record<Locale, Record<string, string>>

/* These are the products' own files, copied byte for byte from pinned source
   commits. The provenance manifest records which identity is current. */
const visuals = {
  studio: { src: '/images/logos/scaleforge-empreinte.svg', width: 1000, height: 386.68 },
  gonota: { src: '/images/logos/nota-mark.png', width: 512, height: 512 },
  tablix: { src: '/images/logos/tablix-mark.svg', width: 512, height: 512 },
  controlCraft: { src: '/images/logos/control-craft.svg', width: 3775, height: 1640 },
  ursly: { src: '/images/logos/ursly-mark.svg', width: 1024, height: 1024 },
} as const

const studio: Record<Locale, Studio> = {
  en: {
    id: 'scaleforged',
    name: 'ScaleForge',
    url: 'https://scaleforged.io',
    category: 'Independent venture studio',
    description: 'We design, build and develop useful products with the people who need them. ScaleForge brings the work together, sharing engineering, design and what we learn while giving every product room to build its own identity.',
    principles: ['People first', 'Shared expertise', 'Distinct product brands'],
    signature: 'Built here. Built to last.',
    visual: visuals.studio,
    socialLinks: [{ label: 'ScaleForge on LinkedIn', href: 'https://www.linkedin.com/company/scaleforged/' }],
  },
  fr: {
    id: 'scaleforged',
    name: 'ScaleForge',
    url: 'https://scaleforged.io',
    category: 'Studio d’entreprises indépendant',
    description: 'Nous concevons et développons des produits utiles avec les gens qui en ont besoin. ScaleForge rassemble le travail et partage l’ingénierie, le design et les apprentissages, tout en laissant à chaque produit sa propre identité.',
    principles: ['L’humain d’abord', 'L’expertise en commun', 'Des marques distinctes'],
    signature: 'Forgé ici. Bâti pour durer.',
    visual: visuals.studio,
    socialLinks: [{ label: 'ScaleForge sur LinkedIn', href: 'https://www.linkedin.com/company/scaleforged/' }],
  },
}

const projects: Record<Locale, readonly PersonalProject[]> = {
  en: [
    {
      id: 'gonota', name: 'GoNota', url: 'https://gonota.ca',
      category: 'Notarial technology',
      description: 'A public calendar where clients across Québec post their notarial act, date and price, and notaries choose the requests that fit their schedule.',
      focus: ['Notarial services', 'Québec'],
      visual: visuals.gonota,
    },
    {
      id: 'tablix', name: 'Tablix', url: 'https://tablix.ca',
      category: 'Document intelligence',
      description: 'Turning complex Québec legal searches into structured, useful data. Built to make repetitive document work easier to review and export.',
      focus: ['Legal workflows', 'Structured data'],
      visual: visuals.tablix,
    },
    {
      id: 'control-craft', name: 'Control Craft', url: 'https://controlcraft.io',
      category: 'Art from memories',
      description: 'Art prints inspired by meaningful places, live events and personal passions. A way to give the memories that matter a place in everyday life.',
      focus: ['Art prints', 'Places and memories'],
      slogan: ['From memory to art.'],
      visual: visuals.controlCraft,
    },
    {
      id: 'ursly', name: 'Ursly', url: 'https://ursly.io',
      category: 'Human and technology interface',
      description: 'Exploring a new interface between people and technology through voice, movement and our senses. A more natural way to interact with the digital world.',
      focus: ['Human interfaces', 'Research'],
      slogan: ['Your senses.', 'Your data.', 'Your choice.'],
      visual: visuals.ursly,
    },
    {
      id: 'offerduel', name: 'OfferDuel', url: 'https://offerduel.io',
      category: '3D commerce experiences',
      description: 'Explorable 3D industry worlds and local negotiation demonstrations.',
      focus: ['3D experiences', 'Negotiation demos'],
      inDevelopment: true,
    },
  ],
  fr: [
    {
      id: 'gonota', name: 'GoNota', url: 'https://gonota.ca',
      category: 'Technologie notariale',
      description: 'Un calendrier public où les clients de partout au Québec publient leur acte notarié, leur date et leur prix. Les notaires choisissent les demandes qui conviennent à leur horaire.',
      focus: ['Services notariaux', 'Québec'],
      visual: visuals.gonota,
    },
    {
      id: 'tablix', name: 'Tablix', url: 'https://tablix.ca',
      category: 'Intelligence documentaire',
      description: 'Des recherches juridiques québécoises complexes transformées en données structurées et utiles. Pour simplifier le travail documentaire répétitif, sa révision et son exportation.',
      focus: ['Workflows juridiques', 'Données structurées'],
      visual: visuals.tablix,
    },
    {
      id: 'control-craft', name: 'Control Craft', url: 'https://controlcraft.io',
      category: 'L’art à partir des souvenirs',
      description: 'Des tirages d’art inspirés des lieux, des événements et des passions qui nous marquent. Une façon de donner aux souvenirs qui comptent une place dans le quotidien.',
      focus: ['Tirages d’art', 'Lieux et souvenirs'],
      slogan: ['Du souvenir à l’art.'],
      visual: visuals.controlCraft,
    },
    {
      id: 'ursly', name: 'Ursly', url: 'https://ursly.io',
      category: 'Interface entre l’humain et la technologie',
      description: 'Une nouvelle interface entre l’humain et la technologie, explorée à travers la voix, le mouvement et nos sens. Pour interagir plus naturellement avec le monde numérique.',
      focus: ['Interfaces humaines', 'Recherche'],
      slogan: ['Vos sens.', 'Vos données.', 'Votre choix.'],
      visual: visuals.ursly,
    },
    {
      id: 'offerduel', name: 'OfferDuel', url: 'https://offerduel.io',
      category: 'Expériences commerciales en 3D',
      description: 'Des univers 3D par secteur et des démonstrations locales de négociation.',
      focus: ['Expériences 3D', 'Démos de négociation'],
      inDevelopment: true,
    },
  ],
}

export function getStudio(locale: Locale): Studio {
  return studio[locale]
}

export function getPersonalProjects(locale: Locale): readonly PersonalProject[] {
  return projects[locale]
}
