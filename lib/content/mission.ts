/* ==========================================================================
   Mission copy, one source of truth for three languages.

   The English quote is the owner's own wording, lightly punctuated and not
   reworded. Every locale page shows that original first, then a translation
   labelled as one, so the quote can never drift between languages.
   ========================================================================== */

import type { Metadata } from 'next'

export type MissionLocale = 'en' | 'fr' | 'zh'

export const MISSION_DATE = '2026-10-24'
export const MISSION_QUOTE_EN =
  'My goal is to unify the world. I would like AI running each and every decision based on data. Why? Creating war, why being against technology. I, Anthony Paquet, AnthonyPaquet.com, want to bring peace, leveraging AI to spend more time with family, more joy and help the society.'

export const MISSION_PATHS: Record<MissionLocale, string> = {
  en: '/mission/',
  fr: '/fr/mission/',
  zh: '/zh/mission/',
}

export const MISSION_ORIGIN = 'https://www.anthonypaquet.com'

export const MISSION_URLS: Record<MissionLocale, string> = {
  en: `${MISSION_ORIGIN}${MISSION_PATHS.en}`,
  fr: `${MISSION_ORIGIN}${MISSION_PATHS.fr}`,
  zh: `${MISSION_ORIGIN}${MISSION_PATHS.zh}`,
}

export type MissionPrinciple = { title: string; body: string }

export type MissionCopy = {
  code: MissionLocale
  htmlLang: string
  homeHref: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  lead: string
  quoteLabel: string
  quote: string
  quoteAttribution: string
  translationLabel: string | null
  translation: string | null
  scopeTitle: string
  scopeBody: string
  principlesTitle: string
  principles: MissionPrinciple[]
  emailCta: string
  emailHref: string
  backHome: string
  languageLabel: string
  switches: { code: MissionLocale; label: string; href: string }[]
}

const switches: MissionCopy['switches'] = [
  { code: 'en', label: 'EN', href: MISSION_PATHS.en },
  { code: 'fr', label: 'FR', href: MISSION_PATHS.fr },
  { code: 'zh', label: '中文', href: MISSION_PATHS.zh },
]

export const missionCopy: Record<MissionLocale, MissionCopy> = {
  en: {
    code: 'en',
    htmlLang: 'en-CA',
    homeHref: '/',
    metaTitle: 'Mission: AI, data and peace',
    metaDescription:
      'Anthony Paquet states his mission in his own words: AI decisions grounded in data, human authority kept, and time returned to family and society.',
    eyebrow: 'Mission',
    title: 'Unifying the world through data',
    lead: 'A public statement of intent, published so it can be quoted, checked, and held against me.',
    quoteLabel: 'His words, verbatim',
    quote: MISSION_QUOTE_EN,
    quoteAttribution: 'Anthony Paquet, anthonypaquet.com, 24 October 2026',
    translationLabel: null,
    translation: null,
    scopeTitle: 'How I read it',
    scopeBody:
      'I read that as an engineering position, not a slogan. Decisions follow measured evidence, AI proposes while a person stays accountable, and every consequential decision is logged so it can be audited. Peace, family time and social benefit are the measures. Nothing here replaces law, consent or human judgment.',
    principlesTitle: 'Three commitments',
    principles: [
      {
        title: 'Evidence before opinion',
        body: 'A decision that cannot name its data cannot name its reason.',
      },
      {
        title: 'People keep authority',
        body: 'AI proposes, a person answers, and the record says who decided and why.',
      },
      {
        title: 'Time is the output',
        body: 'Success is hours returned to family, community and care, not hours captured by a system.',
      },
    ],
    emailCta: 'Email me',
    emailHref: 'mailto:me@anthonypaquet.com',
    backHome: 'Back to the portfolio',
    languageLabel: 'Languages',
    switches,
  },

  fr: {
    code: 'fr',
    htmlLang: 'fr-CA',
    homeHref: '/fr/',
    metaTitle: 'Mission : l’IA, la donnée et la paix',
    metaDescription:
      'Anthony Paquet énonce sa mission dans ses propres mots : des décisions d’IA fondées sur les données, l’autorité humaine conservée, et du temps rendu à la famille et à la société.',
    eyebrow: 'Mission',
    title: 'Unifier le monde par la donnée',
    lead: 'Une déclaration d’intention publique, publiée pour être citée, vérifiée et opposable.',
    quoteLabel: 'Ses mots, textuellement',
    quote: MISSION_QUOTE_EN,
    quoteAttribution: 'Anthony Paquet, 24 octobre 2026',
    translationLabel: 'Traduction française',
    translation:
      'Mon but est d’unifier le monde. Je veux que l’intelligence artificielle prenne chaque décision à partir des données. Pourquoi la guerre ? Pourquoi être contre la technologie ? Moi, Anthony Paquet, anthonypaquet.com, je veux apporter la paix, et utiliser l’IA pour passer plus de temps avec ma famille, plus de joie et aider la société.',
    scopeTitle: 'Comment je le lis',
    scopeBody:
      'Je le lis comme une position d’ingénierie, pas comme un slogan. Les décisions suivent des preuves mesurées, l’IA propose pendant qu’une personne reste responsable, et chaque décision importante est consignée pour être vérifiable. La paix, le temps passé en famille et le bien commun sont les mesures. Rien ici ne remplace la loi, le consentement ni le jugement humain.',
    principlesTitle: 'Trois engagements',
    principles: [
      {
        title: 'La preuve avant l’opinion',
        body: 'Une décision qui ne peut pas nommer ses données ne peut pas nommer sa raison.',
      },
      {
        title: 'L’humain garde l’autorité',
        body: 'L’IA propose, une personne répond, et le registre dit qui a décidé et pourquoi.',
      },
      {
        title: 'Le temps est le résultat',
        body: 'La réussite, ce sont des heures rendues à la famille, à la communauté et aux soins, pas des heures captées par un système.',
      },
    ],
    emailCta: 'Écrivez-moi',
    emailHref: 'mailto:me@anthonypaquet.com',
    backHome: 'Retour au portfolio',
    languageLabel: 'Langues',
    switches,
  },

  zh: {
    code: 'zh',
    htmlLang: 'zh-CN',
    // There is no Chinese portfolio yet, so "back" lands on the English one.
    homeHref: '/',
    metaTitle: '使命：人工智能、数据与和平',
    metaDescription:
      'Anthony Paquet 用自己的话说明他的使命：让人工智能依据数据做决定，把决定权留给人类，并把时间还给家庭与社会。',
    eyebrow: '使命',
    title: '用数据统一世界',
    lead: '一份公开的意向声明，可以被引用、被检验，也可以被用来要求我。',
    quoteLabel: '他的原话',
    quote: MISSION_QUOTE_EN,
    quoteAttribution: 'Anthony Paquet，2026年10月24日',
    translationLabel: '中文译文',
    translation:
      '我的目标是统一世界。我希望人工智能依据数据做出每一个决定。为什么要有战争？为什么要反对技术？我，Anthony Paquet（anthonypaquet.com），希望带来和平，并借助人工智能，把更多时间留给家人，带来更多快乐，帮助社会。',
    scopeTitle: '我如何理解',
    scopeBody:
      '我把这当作一种工程立场，而不是口号。决定以可测量的证据为依据，人工智能提出方案，人承担责任，每一个重要决定都留有记录，可以被审计。和平、与家人相处的时间和社会福祉是衡量的标准。这里没有任何内容取代法律、同意或人的判断。',
    principlesTitle: '三项承诺',
    principles: [
      {
        title: '证据先于意见',
        body: '说不出数据来源的决定，也说不清理由。',
      },
      {
        title: '人保留决定权',
        body: '人工智能提出方案，由人负责，记录写明谁决定以及为什么。',
      },
      {
        title: '时间是成果',
        body: '成功是把时间还给家庭、社区与照护，而不是被系统占走的小时。',
      },
    ],
    emailCta: '发邮件给我',
    emailHref: 'mailto:me@anthonypaquet.com',
    backHome: '返回作品集',
    languageLabel: '语言',
    switches,
  },
}

const HREFLANG: Record<MissionLocale, string> = {
  en: 'en-CA',
  fr: 'fr-CA',
  zh: 'zh-CN',
}

/** Metadata for one mission page: canonical, all three alternates, and Open Graph. */
export function missionMetadata(locale: MissionLocale): Metadata {
  const c = missionCopy[locale]
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: MISSION_URLS[locale],
      languages: {
        'en-CA': MISSION_URLS.en,
        'fr-CA': MISSION_URLS.fr,
        'zh-CN': MISSION_URLS.zh,
        'x-default': MISSION_URLS.en,
      },
    },
    openGraph: {
      type: 'article',
      locale: HREFLANG[locale].replace('-', '_'),
      alternateLocale: (['en', 'fr', 'zh'] as MissionLocale[])
        .filter((code) => code !== locale)
        .map((code) => HREFLANG[code].replace('-', '_')),
      url: MISSION_URLS[locale],
      title: c.metaTitle,
      description: c.metaDescription,
      siteName: 'Anthony Paquet',
    },
  }
}
