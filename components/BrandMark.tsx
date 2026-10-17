/* The personal monogram, drawn from the locked --mark-* tokens so it can never
   drift from public/favicon.svg. Anthony Paquet signs with AP; the venture
   studio and every product present their own brand file instead — see
   docs/project-brand-assets-2026-10-02.json. The mark colours are site tokens in
   app/globals.css, guarded by tests/brand-marks.test.mjs. */

export default function BrandMark({ size = 28, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="13" fill="var(--mark-iron)" />
      <text
        x="32"
        y="43"
        fontSize="37"
        fontWeight="700"
        letterSpacing="-1.5"
        textAnchor="middle"
        fill="var(--mark-bone)"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        AP
      </text>
      <rect x="15" y="49" width="34" height="4" rx="2" fill="var(--mark-brass)" />
    </svg>
  )
}
