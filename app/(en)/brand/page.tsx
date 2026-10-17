import type { Metadata } from 'next'
import MaisonGuide from '@/components/maison-guide'

export const metadata: Metadata = {
  title: 'Maison design system',
  description: 'The design system Anthony Paquet shares with ScaleForge: colour, type, space, components, motion and writing.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.anthonypaquet.com/brand/',
    languages: { 'en-CA': 'https://www.anthonypaquet.com/brand/', 'fr-CA': 'https://www.anthonypaquet.com/fr/brand/' },
  },
}

export default function BrandPage() {
  return <MaisonGuide locale="en" brand="anthony-paquet" homeHref="/" altLocaleHref="/fr/brand/" siblingGuideHref="https://scaleforged.io/en/brand/" standalone />
}
