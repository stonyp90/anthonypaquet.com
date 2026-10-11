# Portrait de référence : la photo en t-shirt - preuves du 11 octobre 2026

Remplace `portrait-evidence-2026-10-02.md` et `linkedin-portrait-2026-10-02.md`
pour tout ce qui touche au choix de la photo. Leurs commandes visent des fichiers
retirés du dépôt; elles restent là comme historique.

## Décision et provenance

Le propriétaire demande que la photo en t-shirt blanc, celle de ses profils
sociaux, remplace la photo en complet partout où son portrait est montré : site,
CV, LinkedIn. La photo en complet reste réservée au pitch de Nota.

Source : fichier fourni par le propriétaire dans la session du 11 octobre 2026,
WebP 1254 × 1254, sRGB, 147 902 octets, SHA-256
`9fa5191399b3003cdfebb84c9456c8fccf380b744ab939442b5d8b78ae762225`.
`public/images/anthony-paquet-portrait.webp` en est une copie identique, sans
recompression. Le visage, les cheveux, le teint et la lumière ne sont pas retouchés.

## Jugements de design (jugement IA, réversibles par le propriétaire)

Rôle pris : directeur artistique du site.

1. **Site : portrait détouré, sans fond ni cadre.** Le 2 octobre, le propriétaire
   a refusé le fond photographique et le cadre arrondi dans le héros. La nouvelle
   photo garde donc ce traitement : sujet seul sur le papier du site, planche de
   surf et plage retirées par le masque. Pour revenir à la photo avec la plage, il
   suffit de retirer `photoMask` du rendu de `Hero`.
2. **CV et LinkedIn : photo ronde avec la plage.** C'est la forme déjà utilisée sur
   les profils sociaux, et le CV publié a un médaillon rond. Le fond y reste.
3. **Un seul portrait dans le dépôt.** Les trois fichiers du portrait en complet
   sont retirés de `public/images/`. Les données structurées lisent maintenant
   `personalInfo.photo`, donc le héros et schema.org ne peuvent plus diverger.
   `tests/portrait.test.mjs` fait échouer le build si un second portrait revient.

## Fichiers

| Actif | Dimensions | Octets | SHA-256 |
| --- | --- | ---: | --- |
| `public/images/anthony-paquet-portrait.webp` | 1254 × 1254 | 147902 | `9fa5191399b3003cdfebb84c9456c8fccf380b744ab939442b5d8b78ae762225` |
| `public/images/anthony-paquet-portrait-mask.webp` | 1254 × 1254, alpha sans perte | 37588 | `6fd7f7bee66f2bc1b14b5ee8c38ed561b6b83973d2c12ebdb0b16413c0bf7996` |
| `public/AnthonyPaquet.pdf` | 2 pages lettre | 447167 | `5cbe1cdcfc54cceb7eafe6e4eec6e093e8efeeb4087b82d5a9285c0bacf06c25` |
| `output/portraits/AnthonyPaquet-LinkedIn-2026-10-11.png` (hors Git) | 1254 × 1254 | 1534971 | `f33e234d7aa85eac2ba1ff1deecec9b4bf8d6627328861a5099dab168184d34d` |

Retirés : `anthony-paquet-pitch.jpg`, `anthony-paquet-pitch.webp`,
`anthony-paquet-cutout-mask.webp`. Aucun autre dépôt local ne pointe vers ces URL.

## Reproduction

Détourage avec Vision (macOS 14 ou plus récent, ici macOS 26.5.1). Le modèle de
détourage de sujet ne tourne que sur le Neural Engine : la commande échoue dans
un bac à sable qui le bloque (« failed to load ANE model »).

```sh
swiftc -O scripts/cutout-portrait.swift -o /tmp/cutout-portrait
/tmp/cutout-portrait public/images/anthony-paquet-portrait.webp /tmp/cutout.png
node scripts/prepare-portrait-mask.mjs \
  --input /tmp/cutout.png \
  --portrait public/images/anthony-paquet-portrait.webp \
  --output public/images/anthony-paquet-portrait-mask.webp \
  --opaque-threshold 250
```

Vision a trouvé une seule instance de premier plan, 49,4 % du cadre : la personne,
sans la planche. Masque : 759 142 pixels opaques, 769 992 transparents, 43 382 de
bord. Aucun pixel RGB de la photo n'est réécrit, seul l'alpha est livré.

CV, depuis le PDF publié avant ce changement (SHA-256 `45472a49…f111007`) :

```sh
git show 01ee435:public/AnthonyPaquet.pdf > /tmp/cv-avant.pdf
python3 scripts/update-cv-portrait.py \
  --portrait public/images/anthony-paquet-portrait.webp \
  --input-pdf /tmp/cv-avant.pdf \
  --output-pdf public/AnthonyPaquet.pdf \
  --report /tmp/portrait-report.json
```

Fichier LinkedIn : conversion sans perte du WebP en PNG avec Sharp 0.34.5; les
pixels décodés sont identiques à ceux de la source.

## Changement d'outil : remplacement chirurgical dans le PDF

`scripts/update-cv-portrait.py` clonait le document avec pypdf, qui réécrit toutes
les chaînes. Avec pypdf 6.11.0, les destinations des liens sortent échappées en
octal (`https\072\057\057…`). C'est du PDF valide, mais le garde
`tests/contact.test.mjs` lit les `/URI` dans les octets bruts et devenait aveugle.
Le test a échoué, comme prévu par son contrôle positif.

Le script remplace maintenant le seul flux de l'image et décale les offsets de la
table de références croisées. Il refuse un PDF à flux d'objets compressés ou une
image qui n'est pas un JPEG RVB. Deux autres changements : le cadre du portrait
n'a plus à être carré (le CV actuel dessine un cadre 880 × 1040 sous un masque
rond qui en montre le carré central), et pypdf ne sert plus qu'à lire et à
comparer l'avant et l'après.

## Vérifications du 11 octobre 2026

- CV : tous les octets hors du flux de l'image, de sa longueur et des offsets sont
  identiques (préfixe, objets suivants, `trailer`). Les cinq `/URI` restent en
  clair. Texte Poppler identique octet par octet (6304 octets).
- CV rendu à 127 ppp : la page 1 ne diffère que dans le médaillon
  (116 × 117 px à +902+58), la page 2 est identique pixel par pixel. Rendu
  agrandi du médaillon inspecté : tête entière, cheveux non coupés.
- Site, aperçu local : héros en 1440 px (EN) et 375 px (FR), image chargée
  (1254 px naturels), masque appliqué, aucun débordement, console sans erreur.
- `npm test` : 46 réussis, 0 échec. `tsc --noEmit` réussi.
  `eslint` réussi sur le dépôt; le seul avertissement vient de
  `tmp/p2338/preview/worker.js`, un fichier local ignoré par Git.
- `npm run build` : l'export ne contient que le nouveau portrait et son masque,
  les deux blocs schema.org pointent vers
  `https://www.anthonypaquet.com/images/anthony-paquet-portrait.webp`, et aucune
  page ne mentionne l'ancien fichier.
- Non exécuté : `tests/browser/*.mjs` (Playwright n'est pas installé ici). Leurs
  assertions sur le nom du fichier sont mises à jour.

## Hors de ce dépôt

- **LinkedIn** : le fichier est prêt, le téléversement reste à faire.
- **Générateur du CV** (`/Users/tony/Documents/Resume/generate.mjs`) : il pointe
  encore vers `anthony-paquet-cv.png`, un détourage de la photo en complet, et la
  variante NRCan vers `anthony-paquet-headshot.png`. La prochaine régénération
  remettrait donc l'ancien visage si ce fichier n'est pas aligné. Non modifié.
- **Nota** : la photo en complet n'apparaît que dans le film du pitch. Rien à
  changer, selon la consigne.

## Versions et références

Node 24.19.0, Sharp 0.34.5, Next 15.5.9, Python 3.14.7, pypdf 6.11.0,
Pillow 12.2.0, Poppler (`pdftoppm`, `pdfimages`, `pdftotext`), ImageMagick.
Aucune dépendance ajoutée ni mise à niveau.

Références d'API utilisées, non reconsultées en ligne durant cette session :
[VNGenerateForegroundInstanceMaskRequest](https://developer.apple.com/documentation/vision/vngenerateforegroundinstancemaskrequest),
[Sharp, canaux](https://sharp.pixelplumbing.com/api-channel/),
[pypdf, images](https://pypdf.readthedocs.io/en/stable/user/extract-images.html).
La structure de la table de références croisées et les échappements octaux des
chaînes viennent de la norme PDF (ISO 32000-1, sections 7.5.4 et 7.3.4.2).
