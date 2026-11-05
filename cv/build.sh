#!/bin/sh
# Régénère les PDF du CV depuis les sources HTML de ce dossier.
# Usage : ./cv/build.sh   (depuis la racine du dépôt ou ce dossier)
# Sorties : EN -> ../public/AnthonyPaquet.pdf ; FR -> ../public/AnthonyPaquet-FR.pdf ;
#           Leloir -> ./dist/CV-Anthony-Paquet-Leloir-MFA-FR.pdf (non publié sur le site)
set -e
cd "$(dirname "$0")"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome" \
           "$(command -v chromium || true)" "$(command -v chromium-browser || true)" \
           "$(command -v google-chrome || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -n "$CHROME" ] || { echo "Chrome/Chromium introuvable — définir CHROME=/chemin/vers/chrome"; exit 1; }

mkdir -p dist
print_pdf () { # $1 = html, $2 = pdf de sortie
  "$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
    --print-to-pdf="$2" "$1" >/dev/null 2>&1
  pages=$(python3 -c "import re,sys; print(re.search(rb'/Count (\d+)', open('$2','rb').read()).group(1).decode())" 2>/dev/null || echo '?')
  echo "$2 — pages: $pages (attendu: 2)"
}
print_pdf cv-en.html     ../public/AnthonyPaquet.pdf
print_pdf cv-fr.html     ../public/AnthonyPaquet-FR.pdf
print_pdf cv-leloir.html dist/CV-Anthony-Paquet-Leloir-MFA-FR.pdf
echo "OK — commiter public/ pour publier (le déploiement Cloudflare suit le push sur main)."
