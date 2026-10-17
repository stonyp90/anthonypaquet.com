/* The two brand marks, drawn from the locked --mark-* tokens so they can never
   drift from public/favicon.svg and public/images/logos/scaleforged.svg.
   Anthony Paquet signs with the AP monogram; ScaleForge with the forge bars.
   Neither mark stands in for the other. The mark colours are site tokens in
   app/globals.css, guarded by tests/brand-marks.test.mjs. */

type Brand = 'anthony-paquet' | 'scaleforge'

export default function BrandMark({ brand, size = 28, className }: { brand: Brand, size?: number, className?: string }) {
  if (brand === 'scaleforge') {
    return (
      <svg className={className} width={size} height={size} viewBox="20 20 24 24" aria-hidden="true" focusable="false">
        <g transform="translate(20 18)">
          <rect x="0" y="12" width="6" height="14" rx="1.5" fill="var(--mark-ember)" />
          <rect x="9" y="2" width="6" height="24" rx="1.5" fill="var(--mark-brass)" />
          <rect x="18" y="6" width="6" height="20" rx="1.5" fill="var(--mark-iron)" />
        </g>
      </svg>
    )
  }
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
