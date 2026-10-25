import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '@/design-system/maison.css'
import '@/app/globals.css'
import { personalInfo, siteUrl } from '@/lib/data'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400', '500', '600'], display: 'swap', preload: false })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f6efe0',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.anthonypaquet.com'),
  title: {
    default: 'Anthony Paquet | AI & Cloud Architect | Engineering Leader',
    template: '%s | Anthony Paquet',
  },
  description: 'AI & Cloud Architect and engineering leader in Québec. Cloud architecture, FinOps, and security consulting. Founder of ScaleForge, the venture studio building GoNota, Tablix, Control Craft, Ursly, and Offer Jewel.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  keywords: [
    // Executive searches
    'AI Architect',
    'Cloud Architect',
    'Engineering Leader',
    'Cloud consultant for startups',
    'Engineering leadership consultant',
    'Technical advisor for startups',
    // Primary services
    'Cloud Security Consultant',
    'FinOps Consultant',
    'SOC2 Implementation',
    'HIPAA Compliance Consultant',
    'AI Security Consultant',
    'Disaster Recovery Architect',
    'Cloud Cost Optimization',
    // Platforms
    'AWS Security Architect',
    'Azure Security Consultant',
    'GCP FinOps Expert',
    'Multi-cloud Architect',
    // Industries
    'FinTech Cloud Security',
    'Healthcare Cloud Compliance',
    'AI Startup SOC2',
    'SaaS Security Consultant',
    // Compliance frameworks
    'SOC 2 Type II',
    'ISO 27001 Implementation',
    'PCI-DSS Compliance',
    'HIPAA Technical Controls',
    // Technical
    'DevSecOps Consultant',
    'Cloud Architecture Review',
    'GPU Cost Optimization',
    'LLM Security',
    // AI Lab / Series A
    'Series A Cloud Architect',
    'AI Lab Cloud Engineer',
    'AI Lab FinOps',
    'AI Training Infrastructure',
    'RL Lab Cloud Architect',
    'RL Lab Security',
    'AI Startup SOC 2 Series A',
    // Studio and products
    'ScaleForge',
    'Quebec venture studio',
    'GoNota',
    'Control Craft',
    'Ursly',
    'Offer Jewel',
    'Tablix',
    'Tablix RDPRM',
    'RDPRM extraction software',
    'Quebec Legal Tech',
    'Logiciel extraction RDPRM',
    'PDF data extraction lawyers Quebec',
    // Current engagements
    'Bespoke Labs',
    'Horizon AI product',
    // Location
    'Cloud Consultant Canada',
    'Cloud Consultant Quebec',
    'Remote Cloud Architect',
    // Name
    'Anthony Paquet',
  ],
  authors: [{ name: 'Anthony Paquet', url: 'https://www.anthonypaquet.com' }],
  creator: 'Anthony Paquet',
  publisher: 'Anthony Paquet',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_CA',
    url: 'https://www.anthonypaquet.com',
    title: 'Anthony Paquet | AI & Cloud Security Architect | Bespoke Labs · Tablix',
    description: 'Engineering leadership, cloud architecture, and ScaleForge: a Québec venture studio building GoNota, Tablix, Control Craft, Ursly, and Offer Jewel.',
    siteName: 'Anthony Paquet, AI & Cloud Architect | Bespoke Labs · Tablix Founder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anthony Paquet, AI & Cloud Security Architect',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthony Paquet | AI & Cloud Architect | Bespoke Labs · Tablix',
    description: 'AI & Cloud Architect, engineering leader, and founder of ScaleForge. Explore the studio and the products we are building in Québec.',
    images: {
      url: '/og-image.png',
      alt: 'Anthony Paquet, AI & Cloud Architect | Bespoke Labs and Tablix',
    },
    site: '@anthonypaquet',
    creator: '@anthonypaquet',
  },
  alternates: {
    canonical: 'https://www.anthonypaquet.com',
    languages: {
      'en-CA': 'https://www.anthonypaquet.com',
      'fr-CA': 'https://www.anthonypaquet.com/fr/',
      'x-default': 'https://www.anthonypaquet.com',
    },
  },
  category: 'technology',
  classification: 'Professional Services',
}

// Structured data shows the hero portrait, so the site has one portrait of record.
const portraitUrl = `${siteUrl}${personalInfo.photo}`

// Person Schema - for knowledge graph
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.anthonypaquet.com/#person',
  name: 'Anthony Paquet',
  url: 'https://www.anthonypaquet.com',
  image: portraitUrl,
  jobTitle: 'AI & Cloud Security Architect',
  description: 'Independent AI & Cloud Architect specializing in FinOps (30 to 60% cost reduction), compliance (SOC 2, HIPAA, PCI-DSS), infrastructure security, and disaster recovery for Series A AI labs and growth-stage companies. Previously engaged with Bespoke Labs (Series A RL lab) and founder of Tablix Inc., a Quebec SaaS for legal-document extraction.',
  sameAs: [
    'https://linkedin.com/in/anthony-paquet-94a31085',
    'https://github.com/stonyp90',
    'https://tablix.ca',
  ],
  knowsAbout: [
    'Cloud Cost Optimization',
    'FinOps',
    'SOC 2 Compliance',
    'HIPAA Compliance',
    'PCI-DSS',
    'ISO 27001',
    'AWS Security',
    'Azure Security',
    'Google Cloud Platform',
    'AI/LLM Security',
    'AI Lab Cloud Architecture',
    'AI Training Infrastructure',
    'Series A Startup Scaling',
    'RL Lab Operations',
    'Disaster Recovery',
    'DevSecOps',
    'GPU Cost Optimization',
    'Legal Tech (Quebec)',
    'PDF Data Extraction',
    'RDPRM Extraction',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Certified Solutions Architect, Associate',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Certified Developer, Associate',
      credentialCategory: 'certification',
    },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Nota',
    url: 'https://gonota.ca',
  },
  owns: [
    {
      '@type': 'Organization',
      '@id': 'https://scaleforged.io/#org',
      name: 'ScaleForge',
      url: 'https://scaleforged.io',
      logo: 'https://www.anthonypaquet.com/images/logos/scaleforge-empreinte.svg',
      description: 'Independent venture studio in Québec building GoNota, Tablix, Control Craft, Ursly, and Offer Jewel. The studio brings product design, engineering, and AI into short feedback loops while each product keeps its own brand and audience.',
      brand: [
        { '@type': 'Brand', name: 'GoNota', url: 'https://gonota.ca' },
        { '@type': 'Brand', name: 'Tablix', url: 'https://tablix.ca' },
        {
          '@type': 'Brand',
          name: 'Control Craft',
          url: 'https://controlcraft.io',
          slogan: 'From memory to art.',
          description: 'Art prints inspired by meaningful places, live events, and personal memories.',
        },
        { '@type': 'Brand', name: 'Ursly', url: 'https://ursly.io' },
        { '@type': 'Brand', name: 'Offer Jewel', description: 'A studio project in development within ScaleForge.' },
      ],
      areaServed: {
        '@type': 'Place',
        name: 'Quebec, Canada',
      },
      sameAs: ['https://www.linkedin.com/company/scaleforged/'],
    },
    {
      '@type': 'Organization',
      '@id': 'https://tablix.ca/#org',
      name: 'Tablix Inc.',
      url: 'https://tablix.ca',
      logo: 'https://www.anthonypaquet.com/images/logos/tablix-mark.png',
      description: 'Quebec-based SaaS that turns legal PDFs (RDPRM, REQ, hypothèques, contracts) into structured Excel, Word, or branded-PDF tables. Built in partnership with Stein Monast for avocats, notaires, and assistantes juridiques. Full coverage of all 112 RDPRM natures de droit, automated hypothèque deduplication, output formatted to industry best practices.',
      areaServed: {
        '@type': 'Place',
        name: 'Quebec, Canada',
      },
      memberOf: {
        '@type': 'Organization',
        name: 'Stein Monast',
        description: 'Quebec law firm. Tablix partner.',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://gonota.ca/#org',
      name: 'Nota',
      url: 'https://gonota.ca',
      description: 'The modern notary experience for Quebec. Software designed around how notaries and their clients actually work, replacing a slow, paper-heavy process.',
      areaServed: {
        '@type': 'Place',
        name: 'Quebec, Canada',
      },
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Quebec',
    addressCountry: 'Canada',
  },
  // The published mission statement, in the owner's own words. Other pages
  // link to it from there, so the entity and the statement stay connected.
  subjectOf: {
    '@type': 'WebPage',
    '@id': 'https://www.anthonypaquet.com/mission/#page',
    url: 'https://www.anthonypaquet.com/mission/',
    name: 'Mission: AI, data and peace',
    inLanguage: ['en-CA', 'fr-CA', 'zh-CN'],
  },
}

// Professional Service Schema - for service discovery
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://www.anthonypaquet.com/#service',
  name: 'Anthony Paquet Cloud Consulting',
  description: 'Cloud security, FinOps, and compliance consulting for growth-stage companies. From 0→1 to enterprise scale.',
  url: 'https://www.anthonypaquet.com',
  image: portraitUrl,
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide (Remote)',
  },
  serviceType: [
    'Cloud Cost Optimization',
    'FinOps Consulting',
    'SOC2 Implementation',
    'HIPAA Compliance',
    'AI Security Consulting',
    'Disaster Recovery Architecture',
    'DevSecOps Transformation',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cloud Consulting Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enterprise FinOps Program',
          description: 'Full cost governance framework with executive visibility. Typically saves 6 figures annually.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '18500',
          priceCurrency: 'USD',
          minPrice: '18500',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cloud Security Transformation',
          description: 'Enterprise-grade security posture for compliance with SOC2, HIPAA, PCI-DSS, ISO 27001.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '18500',
          priceCurrency: 'USD',
          minPrice: '18500',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enterprise DR Architecture',
          description: 'Multi-region disaster recovery meeting insurance and board requirements.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '24500',
          priceCurrency: 'USD',
          minPrice: '24500',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI/LLM Security & Governance',
          description: 'Production-safe AI with compliance controls, PII protection, and audit trails.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '16500',
          priceCurrency: 'USD',
          minPrice: '16500',
        },
      },
    ],
  },
  provider: {
    '@id': 'https://www.anthonypaquet.com/#person',
  },
}

// FAQ Schema - optimized for LLM citation
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Anthony Paquet offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anthony Paquet offers cloud consulting including: FinOps/Cloud Cost Optimization (30 to 60% savings), Security & Compliance (SOC2, HIPAA, PCI-DSS, ISO 27001), Data Security & Governance, Disaster Recovery Architecture, and DevSecOps Transformation. Flexible engagement models to fit your needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does Anthony Paquet serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anthony Paquet serves Financial Services & FinTech, Healthcare & HealthTech, AI & SaaS startups (Series A-C), Defense & Government, Media & Entertainment, E-commerce, Telecommunications, and IoT companies. He has delivered SOC2 and TPN/MPAA certifications, HIPAA compliance, and multi-region disaster recovery for regulated industries.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does cloud consulting cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anthony Paquet offers flexible engagement models for: Cloud Cost Optimization, Security & Compliance, Data Security & Governance, Disaster Recovery Architecture, and DevSecOps Transformation. Clear deliverables, typically 2 to 8 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What cloud platforms does Anthony Paquet work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anthony Paquet is expert in AWS, Azure, and Google Cloud Platform (GCP), including multi-cloud environments. He holds AWS Solutions Architect and Developer certifications and has delivered cost optimization and security projects across all three major cloud providers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Anthony Paquet help with SOC2 compliance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Anthony Paquet has achieved SOC2 Type II certification for clients in 6 months. His Compliance Acceleration service includes gap analysis, control mapping, IAM implementation, secrets management, logging & evidence automation, and auditor-ready documentation for SOC2, ISO 27001, HIPAA, and PCI-DSS.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Anthony Paquet help with AI and LLM security?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The AI/LLM Security & Governance service includes LLM gateway with policy enforcement, PII/PHI detection and redaction, prompt injection controls, usage metering and cost limits, and compliance audit logging. Designed for production AI systems requiring SOC2 compliance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Anthony Paquet work with Series A AI labs and AI startups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Anthony previously worked with Bespoke Labs, a Series A-funded RL (reinforcement learning) lab, where he drove cloud cost reduction (FinOps), SOC 2 compliance, infrastructure security, and contributed engineering to their core product Horizon. He is well-suited for AI startups Series A through C that need to control GPU and inference costs, achieve SOC 2 for enterprise sales, and harden security before scaling.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Tablix and who is it for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tablix (https://tablix.ca) is a Quebec-based SaaS founded by Anthony Paquet, built in partnership with Stein Monast. It compresses hours of paralegal work into seconds by pulling legal cross-references straight from RDPRM, REQ, and hypothèque PDFs into structured Excel, Word, or branded-PDF tables formatted to industry best practices. Built for avocats (lawyers), notaires (notaries), and assistantes juridiques (legal assistants) in Quebec, it covers all 112 RDPRM natures de droit and includes automatic hypothèque deduplication across legal entity names. The ROI is concrete: an afternoon of manual transcription per file, returned to billable client work.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is RDPRM extraction and does Tablix cover the full register?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RDPRM (Registre des droits personnels et réels mobiliers) is Quebec\'s personal and movable property security register. Tablix performs full RDPRM extraction across all 112 natures de droit (rights categories), turning RDPRM PDF extracts into clean structured tables with automatic deduplication of hypothèque entries across entity names. It also handles REQ (Registraire des entreprises) extracts and other Quebec legal documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Anthony Paquet based and does he work remotely?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anthony Paquet is based in Quebec, Canada and works remotely worldwide. He has delivered cloud and security projects for clients in North America, Europe, and across Quebec and Canada. Engagements are remote-first with on-site meetings as needed.',
      },
    },
  ],
}

// SoftwareApplication Schema - for Tablix (Anthony's owned product)
const tablixSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': 'https://tablix.ca/#software',
  name: 'Tablix',
  url: 'https://tablix.ca',
  logo: 'https://www.anthonypaquet.com/images/logos/tablix-mark.png',
  image: 'https://www.anthonypaquet.com/images/logos/tablix-mark.png',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Quebec SaaS for legal-document extraction, built in partnership with Stein Monast. Turns RDPRM, REQ, and hypothèque PDFs into structured Excel, Word, or branded-PDF tables in seconds. Full coverage of all 112 RDPRM natures de droit with automatic hypothèque deduplication, output formatted to industry best practices. ROI for law firms: an afternoon of paralegal transcription, returned to billable client work.',
  inLanguage: ['fr-CA', 'en-CA'],
  audience: {
    '@type': 'Audience',
    audienceType: 'Lawyers, notaries, and legal assistants in Quebec',
  },
  featureList: [
    'Full RDPRM extraction (112 natures de droit)',
    'REQ (Registraire des entreprises) extraction',
    'Hypothèque deduplication across legal entity names',
    'Excel, Word, and branded PDF output',
    'AI-powered column detection',
    'Output formatted to industry best practices',
  ],
  publisher: {
    '@id': 'https://www.anthonypaquet.com/#person',
  },
  mentions: {
    '@type': 'Organization',
    name: 'Stein Monast',
    description: 'Quebec law firm and Tablix product partner.',
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
  },
}

// WebSite Schema - entity home for search engines and AI answer engines
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.anthonypaquet.com/#website',
  url: 'https://www.anthonypaquet.com',
  name: 'Anthony Paquet',
  description: 'AI & Cloud Security Architect. FinOps, SOC 2 / HIPAA compliance, infrastructure security, and disaster recovery for Series A AI labs and growth-stage companies.',
  inLanguage: ['en-CA', 'fr-CA'],
  publisher: { '@id': 'https://www.anthonypaquet.com/#person' },
  about: { '@id': 'https://www.anthonypaquet.com/#person' },
}

// Combined schema array
const jsonLd = [websiteSchema, personSchema, serviceSchema, faqSchema, tablixSchema]

export default function SiteDocument({
  children,
  lang,
}: {
  children: React.ReactNode
  lang: 'en' | 'fr' | 'zh-CN'
}) {
  return (
    <html lang={lang} data-brand="anthony-paquet" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  )
}
