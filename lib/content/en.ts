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
      lead: 'I talk to AI from my phone. It turns my intent into a plan, keeps the useful context with the task, then builds and verifies the result on its own. I remove blockers so every loop is as short as possible, from local implementation to customer feedback. The same approach connects engineering, infrastructure, and go-to-market.',
      pull: 'Sitting down to type a prompt is already one step too many.',
      phases: [
        { tag: '01', title: 'Speak', blurb: 'I give AI the intent, context, and outcome I want, by voice.' },
        { tag: '02', title: 'Plan', blurb: 'AI turns the request into a concrete plan, tasks, acceptance criteria, and expected evidence.' },
        { tag: '03', title: 'Unblock', blurb: 'Access, data, environments, tests, and previews are ready so it can act without waiting.' },
        { tag: '04', title: 'Design', blurb: 'The business domain leads. Ports and adapters keep tools, models, and clouds replaceable.' },
        { tag: '05', title: 'Build', blurb: 'AI builds the first useful slice and opens the sub-loops it needs.' },
        { tag: '06', title: 'Iterate', blurb: 'It works locally against the plan: run, observe, fix, and repeat, with context attached to the task.' },
        { tag: '07', title: 'Test', blurb: 'Each domain is checked with unit tests, BDD, and controls matched to the risk.' },
        { tag: '08', title: 'Review', blurb: 'A second scheduled task, on another model, cross-validates the result and flags gaps before release.' },
        { tag: '09', title: 'Ship', blurb: 'Depending on the use case, we ship to one customer, a beta cohort, or everyone. Versions can coexist when needed.' },
        { tag: '10', title: 'Learn', blurb: 'Real usage and customer feedback show what works, what blocks, and what creates value.' },
        { tag: '11', title: 'Improve', blurb: 'The agent updates the product, the plan, and the offer from evidence, not assumptions.' },
        { tag: '12', title: 'Repeat', blurb: 'We start again with context, learning, and access already in place, making the next loop shorter.' },
      ],
      centerEyebrow: 'The target',
      centerLabel: 'Business outcomes',
      loopHint: 'shortest loop',
      interactHint: 'Hover or tap a step',
      proof: {
        intro: 'The loop does not stop at code: it reaches real usage, then comes back with evidence.',
        title: 'Made by the loop',
        name: 'Lunorive',
        blurb: 'My newest product, created in this loop without human interaction: framed art prints of the places people love.',
        cta: 'See Lunorive in my projects',
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
