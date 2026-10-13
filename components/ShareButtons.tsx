'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { FaLinkedinIn, FaEnvelope, FaLink, FaCheck } from 'react-icons/fa'
import { siteUrl, shareText } from '@/lib/data'
import { useContent } from '@/components/LocaleProvider'

const encodedUrl = encodeURIComponent(siteUrl)

const buttonClass =
  'inline-flex items-center justify-center w-11 h-11 min-w-11 min-h-11 rounded-full border border-[var(--color-border-strong)] bg-paper text-ink-soft hover:text-accent-text hover:border-accent transition-colors duration-300'

export default function ShareButtons() {
  const c = useContent()
  const [copied, setCopied] = useState(false)

  const shareLinks = [
    {
      label: c.ui.share.shareOnLinkedIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedinIn,
    },
    {
      label: c.ui.share.shareByEmail,
      href: `mailto:?subject=${encodeURIComponent('Anthony Paquet, AI & Cloud Architect')}&body=${encodeURIComponent(`${shareText} ${siteUrl}`)}`,
      icon: FaEnvelope,
      isMail: true,
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <span className="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">
        {c.ui.share.title}
      </span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <m.a
            key={link.label}
            href={link.href}
            target={link.isMail ? undefined : '_blank'}
            rel={link.isMail ? undefined : 'noopener noreferrer'}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            aria-label={link.label}
            title={link.label}
          >
            <link.icon className="text-base" />
          </m.a>
        ))}
        <m.button
          type="button"
          onClick={handleCopy}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={
            copied
              ? 'inline-flex items-center justify-center w-11 h-11 min-w-11 min-h-11 rounded-full border border-[var(--color-live)] bg-[var(--color-live-bg)] text-[var(--color-live)] transition-colors duration-300'
              : buttonClass
          }
          aria-label={copied ? c.ui.share.linkCopied : c.ui.share.copyLink}
          title={copied ? c.ui.share.linkCopied : c.ui.share.copyLink}
        >
          {copied ? <FaCheck className="text-base" /> : <FaLink className="text-base" />}
        </m.button>
      </div>
    </div>
  )
}
