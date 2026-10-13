# Email signature

Source of the Gmail signature for me@anthonypaquet.com.

- `signature.en.html`: tagline "Builder · Leader · AI & Cloud Specialist" plus a link to "Agent in the loop"
- `signature.fr.html`: tagline "Bâtisseur · Leader · Spécialiste IA & Cloud" plus a link to "L’agent dans la boucle"

The images are served by the site, so they must stay at these paths once a signature has been sent:

- `public/email/ap-logo.png` → https://www.anthonypaquet.com/email/ap-logo.png (192 px, shown at 96 px, same height as the text block)
- `public/email/linkedin.png` → https://www.anthonypaquet.com/email/linkedin.png (64 px, shown at 16 px; Font Awesome `linkedin` glyph, the same icon the site footer uses through react-icons)

The HTML uses tables and inline styles only, because Gmail, Outlook and Apple Mail drop `<style>` blocks, SVG and web fonts in signatures. To install it, open the HTML in a browser, copy the rendered signature and paste it into Gmail: Settings › General › Signature. Pasting the raw HTML does not work.

The signature only links to the inbox, the site and LinkedIn. No scheduler links, per `tests/contact.test.mjs`.
