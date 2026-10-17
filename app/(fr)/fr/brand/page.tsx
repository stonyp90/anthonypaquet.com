import type { Metadata } from 'next'
import MaisonGuide from '@/components/maison-guide'

export const metadata: Metadata = {
  title: 'Système de design Maison',
  description: 'Le système de design partagé par Anthony Paquet et ScaleForge : couleur, typographie, espace, composants, mouvement et rédaction.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.anthonypaquet.com/fr/brand/',
    languages: { 'en-CA': 'https://www.anthonypaquet.com/brand/', 'fr-CA': 'https://www.anthonypaquet.com/fr/brand/' },
  },
}

export default function BrandPageFr() {
  return <MaisonGuide locale="fr" brand="anthony-paquet" homeHref="/fr/" altLocaleHref="/brand/" siblingGuideHref="https://scaleforged.io/brand/" standalone />
}
