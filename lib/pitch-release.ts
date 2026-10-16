/**
 * Release gate for the ScaleForge investor pitch entry point.
 *
 * The pitch stays private until the final review passes and the owner
 * releases it (see docs/scaleforge-pitch/README.md). While the gate is
 * pending, no component may render a pitch link. The domain keeps the
 * pitch configuration outside the code, matching the studio repository's
 * own release gate.
 */

export type PitchLocale = 'en' | 'fr'

export type PitchRelease = {
  status: string
  verified: boolean
  revision: string | null
  note?: string
  locales: Record<PitchLocale, { href: string, label: string }>
}

/** Returns the bilingual entries only for a released, verified pitch. */
export function pitchLinks(release: PitchRelease): PitchRelease['locales'] | null {
  if (release.status !== 'live' || release.verified !== true) return null
  return release.locales
}
