/* ==========================================================================
   English site content (canonical shape).
   Section data is reused from lib/data.ts; UI copy lives under `ui`.
   The French file (fr.ts) mirrors this exact shape.
   ========================================================================== */

import {
  personalInfo,
  socialLinks,
  services,
  experiences,
  certifications,
  education,
  languages,
} from '@/lib/data'

export const en = {
  personalInfo,
  socialLinks,
  services,
  experiences,
  certifications,
  education,
  languages,

  ui: {
    /* Language switch */
    locale: {
      code: 'en',
      label: 'EN',
      otherLabel: 'FR',
      switchTo: 'Voir en français',
      otherPath: '/fr/',
    },

    navigation: {
      label: 'Main navigation',
      skip: 'Skip to content',
      services: 'Services',
      experience: 'Experience',
      projects: 'Personal projects',
    },

    hero: {
      badge: 'Currently accepting new engagements',
      headlineLead: 'I help engineering leaders',
      headlineAccent: 'ship faster, cut costs, become secure and compliant',
      subtitleLead: 'Builder & Engineering Leader,',
      subtitleStrong: 'results in weeks, not quarters',
      subtitleTail: '. No long-term contracts required.',
      trustPoints: [
        'AI & Cloud Expert',
        'Security and compliance',
        'FinOps',
        'Fortune 500 & Startup Experience',
      ],
      ctaPrimary: 'Email me',
      ctaLinkedIn: 'LinkedIn',
      ctaResume: 'Resume',
      ctaProjects: 'Explore my personal projects',
    },

    about: {
      label: 'About',
      facts: ['Proud dad of two', 'Avid snowboarder', 'Tech passionate'],
      tags: ['Quebec, Canada', 'French & English'],
    },

    work: {
      sectionName: 'How I Work',
      headingLead: 'Agent in the',
      headingAccent: 'loop',
      lead: 'I design the software development lifecycle so the agent iterates on its own. I remove every blocker so each iteration is as short as possible, and the agent opens its own sub-loops when a task calls for it. Work starts from my voice on my phone and runs on cloud resources, with other senses next. Same approach for go-to-market, engineering, and infrastructure.',
      pull: 'Sitting down to type a prompt is already one step too many.',
      phases: [
        { tag: '01', title: 'Speak', blurb: 'A voice note from my phone starts the work. No desk, no manual prompt.' },
        { tag: '02', title: 'Unblock', blurb: 'Access, tests, and previews are wired so nothing waits on a human.' },
        { tag: '03', title: 'Iterate', blurb: 'The agent builds, tests, and fixes on its own, opening sub-loops as needed.' },
        { tag: '04', title: 'Ship', blurb: 'Release, measure real usage, and start the next, shorter loop.' },
      ],
      centerEyebrow: 'The target',
      centerLabel: 'Business outcomes',
      loopHint: 'shortest loop',
      interactHint: 'Hover or tap a step',
      foundations: {
        intro: 'The technology is ready, so the loop runs the whole business, not only the code.',
        businessTitle: 'The business runs in the loop too',
        business: [
          { title: 'Targeting', blurb: 'Agents post in communities and on social media to reach the right customers.' },
          { title: 'Payment', blurb: 'The loop fully integrates Stripe into every product I sell. Checkout and payments run on their own. A sale never waits on a person.' },
          { title: 'Behavior', blurb: 'Every visit teaches the agent what makes people buy.' },
          { title: 'Improvement', blurb: 'Offers, pages, and spend keep adjusting so acquiring a customer costs less than the sale.' },
        ],
        buildTitle: 'Built on the business, not the tools',
        build: [
          { title: 'Technology agnostic', blurb: 'The business domain leads. Any tool, model, or cloud can be swapped.' },
          { title: 'Hexagonal architecture', blurb: 'Ports and adapters keep every domain free of technology choices.' },
          { title: 'Tested domain by domain', blurb: 'Every business domain is covered by unit tests and behavior tests (BDD).' },
        ],
        reviewTitle: 'The loop reviews itself',
        review: [
          { title: 'Scheduled tasks', blurb: 'I hand the work to models as scheduled tasks.' },
          { title: 'Cross-validation', blurb: 'A hook starts another scheduled task, on a different model, to cross-validate each result.' },
          { title: 'Dynamic review', blurb: 'Reviews run on their own, with no human intervention.' },
        ],
        output: {
          title: 'Made by the loop',
          name: 'Lunorive',
          blurb: 'My newest product, created in this loop without human interaction: framed art prints of the places people love.',
          cta: 'See Lunorive in my projects',
        },
      },
    },

    services: {
      label: 'Services',
      headingLead: 'Consulting',
      headingAccent: '·',
      headingTail: 'engineering leadership.',
      lead: 'Flexible engagement models with clear outcomes. From 0→1 to enterprise scale. Results in weeks, not quarters.',
      categories: {
        ai: {
          title: 'AI',
          subtitle: 'AI Infrastructure • LLM Security • Agents & Evals',
          description:
            'Take AI from demo to dependable. Infrastructure, security, evals, and agent engineering for teams shipping real AI products.',
        },
        architecture: {
          title: 'Architecture',
          subtitle: 'Modernization • Platform • DevSecOps',
          description:
            'From legacy to modern. Build scalable foundations, eliminate tech debt, and accelerate your roadmap.',
        },
        finops: {
          title: 'FinOps',
          subtitle: 'Cloud Cost Intelligence',
          description:
            'Cut cloud spend 30 to 50% with governance that scales. Typical ROI: 5 to 10x within 12 months.',
        },
        security: {
          title: 'Security & Compliance',
          subtitle: 'SOC2 • HIPAA • ISO 27001 • AI Security',
          description:
            'Audit-ready in weeks, not months. Enterprise-grade security that satisfies customers and insurers.',
        },
      },
      engagementTitle: 'How we work together',
      engagementBodyLead: 'All engagements include',
      engagementBodyStrong: 'clearly defined scope and deliverables',
      engagementBodyTail:
        '. Flexible pricing models, fixed-price or hourly, to fit your needs. We’ll discuss your specific requirements and provide a tailored proposal.',
      engagementTags: [
        'Scoped for your environment',
        'Clear deliverables',
        'Defined timeline',
        'Measurable outcomes',
      ],
      provenResultsStrong: 'Proven results:',
      provenResultsTail:
        ' FinOps clients typically see 5 to 10x ROI within 12 months. Compliance fast-tracks save 3 to 6 months vs DIY approaches.',
      contactCta: 'Email me about your project',
      contactHint: 'Send the outcome you need and the constraints you have. I answer in French or English.',
    },

    experience: {
      label: 'Track Record',
      heading: 'Experience',
      lead: 'Proven outcomes across cloud, security, and infrastructure.',
      current: 'Current',
      founder: 'Founder',
      via: 'via',
      keyAchievements: 'Key Achievements',
    },

    certifications: {
      label: 'Credentials',
      headingLead: 'Certifications',
      headingAccent: '·',
      headingTail: 'education.',
      awsTitle: 'AWS Certifications',
      educationTitle: 'Education',
      languagesTitle: 'Languages',
    },

    footer: {
      tagline: 'Builder and engineering leader.',
      blurb: 'I help teams ship faster, cut costs, and become compliant.',
      contactCta: 'Email me',
      exploreTitle: 'Explore',
      connectTitle: 'Connect',
      quickLinks: [
        { href: '#services', label: 'Services' },
        { href: '#about', label: 'About' },
        { href: '#experience', label: 'Experience' },
        { href: '#certifications', label: 'Certifications' },
        { href: '#personal-projects', label: 'Personal projects' },
      ],
      rights: 'All rights reserved.',
      builtWith: 'Built with Next.js, TypeScript & Tailwind CSS',
    },

    share: {
      title: 'Share this page',
      copyLink: 'Copy link',
      linkCopied: 'Link copied',
      shareOnLinkedIn: 'Share on LinkedIn',
      shareByEmail: 'Share by email',
    },
  },
}

export type SiteContent = typeof en
