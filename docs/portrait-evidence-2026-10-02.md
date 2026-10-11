# Portrait du pitch et CV - preuves du 2 octobre 2026

> Remplacé le 11 octobre 2026 : le portrait de référence est maintenant la photo
> en t-shirt. Voir `portrait-evidence-2026-10-11.md`. Les fichiers nommés ici ont
> été retirés du dépôt.

## Décision et provenance

Le propriétaire demande de réutiliser la photo de son pitch deck, avec le teint
légèrement bronzé et les cheveux relevés au vent, pour son site et son CV.
La source inspectée visuellement est
`/Users/tony/Github/nota/docs/video-studio/assets/fondateur.jpg` (880 × 1040).
Elle est référencée par le pitch narré dans
`docs/video-studio/src/films/pitch-en/scenes.html:315`; commit d'origine Nota
`bb7e29de8`, 25 septembre 2026. Le petit carré
`docs/pitch-deck/founder-photo.png` coupe les cheveux et n'a pas été retenu.

Le JPG du site est une copie identique de la source. Le WebP conserve le cadre
complet et les proportions, réduit à 704 × 832 avec Lanczos, qualité 85, méthode
6. Le visage, les cheveux, le teint et la lumière n'ont pas été retouchés.

## Architecture et reproduction

`scripts/update-cv-portrait.py` est un outil hors ligne isolé des composants du
site. Les chemins, la page et l'image PDF ciblées, les dimensions WebP et les
qualités d'encodage sont des arguments. Il clone le document PDF complet et
remplace uniquement l'image existante; il ne régénère pas le CV depuis HTML.
Il vérifie les invariants du document en mémoire avant d'écrire le résultat.
Il n'ajoute aucune dépendance à l'application web, route HTTP ou service.

Pour retrouver le PDF de départ depuis le Git du site :

```sh
git show d6c6ed85f705031728661458a082618ed82ee5b8:public/AnthonyPaquet.pdf > /tmp/anthony-cv-before.pdf
python3 scripts/update-cv-portrait.py \
  --portrait public/images/anthony-paquet-pitch.jpg \
  --input-pdf /tmp/anthony-cv-before.pdf \
  --output-pdf /tmp/AnthonyPaquet.pdf \
  --webp /tmp/anthony-paquet-pitch.webp \
  --report /tmp/portrait-report.json
```

L'outil utilise `pypdf[image]` et Pillow. En session, le Python fourni par Codex
était `/Users/tony/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.
Le marqueur PDF `mark_artifact_operation_started.mjs --operation-kind edit
--expected-output-count 1 --output-format pdf` a été appelé avec succès exactement
une fois avant la première édition du PDF.

## Formats, poids et SHA-256

| Actif | Dimensions / pages | Octets | SHA-256 |
| --- | --- | ---: | --- |
| Source Nota et `public/images/anthony-paquet-pitch.jpg` | 880 × 1040 | 109771 | `0f0247a0d005fb6a7f53969c03c909c34db33a5afa6cb44050a863ba5d36a811` |
| `public/images/anthony-paquet-pitch.webp` | 704 × 832 | 50454 | `20ed7cf289cdc880da91ab79ae1ba38381b668d3f469c3bdbd259eec472054d8` |
| CV public avant | 2 pages lettre | 596632 | `ff5efb07619930d168d337d1d7e59bec74ac9f8044493004f8c6f435d956b699` |
| `public/AnthonyPaquet.pdf` après | 2 pages lettre | 289886 | `517f35c322073bb81ac953f0b9e4a85fc3d1ab27483f395ce645774c58a7aee3` |

Le PDF est réduit de 51,4 % et le WebP représente 46,0 % du poids de la source
JPG. Ces valeurs décrivent les fichiers locaux, sans mesure de chargement en
production.

Le CV a été régénéré le 6 octobre 2026 pour suivre le catalogue d'expériences du
site, donc la ligne « après » ci dessus est un instantané du 2 octobre et le
fichier servi n'a plus cette empreinte. Le portrait incorporé reste le JPG du
pitch 880 × 1040. À remesurer plutôt que de lire ce tableau :

```sh
shasum -a 256 public/images/anthony-paquet-pitch.jpg public/AnthonyPaquet.pdf
pdfinfo public/AnthonyPaquet.pdf | grep Pages
pdfimages -list public/AnthonyPaquet.pdf | head -3
```

## Vérification du CV

La photo ronde de la page 1 utilisait auparavant le portrait en bateau, t-shirt
rose. Le nouvel objet image reste 400 × 400 pixels à la même position et conserve
le masque rond original. Le portrait vertical est ajusté dans ce carré sans
déformation et avec de petites marges latérales dont la teinte est échantillonnée
dans un coin du fond de la source. L'encodage de l'image PDF utilise JPEG qualité
95, sans sous-échantillonnage couleur.

Vérifications réussies, avant/après :

- 2 pages, MediaBox/CropBox `[0, 0, 612, 792]`, rotation 0, PDF 1.4.
- Texte extrait égal avec pypdf, SHA-256
  `4ac3e58996ad8c43c0f65b2079e7a2feb740703206610a381ef8dfcf4d7cecd2`.
- Texte extrait par Poppler égal octet par octet, 5636 octets, SHA-256
  `8d0ee2af5859487d66fe348c0415e8b170cebb7457c93f6ea0163a1d2ccfac88`.
- Flux de contenu de la page 1 identique, SHA-256
  `7fe70578aaa4295948a6e8d127ebd539e986c77e18f657477974b40bf5df454f`.
- Flux de contenu de la page 2 identique, SHA-256
  `8eb8bb07ed9ead734b14b340cfd9b6ed98e7b118d11df3979ccddfe440c9a628`.
- Annotations et destinations URI identiques : 4 sur chaque page.
- Métadonnées originales, balisage et présence de l'arbre de structure préservés.
- Rendus Poppler des deux pages finales inspectés visuellement, sans défaut.
  À 1082 × 1400, la différence pixels de la page 1 est limitée au portrait
  `(896, 71, 1019, 194)`; la page 2 est identique pixel par pixel.
- Ruff 0.16.10 : format et lint `E,F,I` réussis; compilation Python réussie.

Le résumé et la section EXPERIENCE du PDF ne contiennent aucune mention de Nota,
Tablix, Ursly ou ScaleForged. La page 2 contient une section séparée PERSONAL
PROJECTS avec Diaspor, Tablix, PlainLedger et SST Diamantex. Ces textes restent
identiques après le remplacement de la photo.

## Versions et documentation officielle consultée

Consultation le 2 octobre 2026; aucune mise à niveau des dépendances du site.

| Outil | Version constatée | Source et choix |
| --- | --- | --- |
| Python | 3.12.14 | [Flux binaires `BytesIO`](https://docs.python.org/3.12/library/io.html#io.BytesIO), documentation de la branche 3.12; édition en mémoire avant écriture et UTF-8 explicite pour le rapport JSON. La page figée 3.12.14 était inaccessible via l'outil web. |
| pypdf | 6.10.0 | [Clonage de document et en-tête PDF](https://pypdf.readthedocs.io/en/6.10.0/modules/PdfWriter.html), [remplacement `ImageFile.replace`](https://pypdf.readthedocs.io/en/6.10.0/_modules/pypdf/_page.html#ImageFile.replace), [inventaire des images](https://pypdf.readthedocs.io/en/6.10.0/user/extract-images.html). Clonage complet pour préserver texte, liens, structure et métadonnées; en-tête 1.4 maintenu explicitement. |
| Pillow | 12.3.0 | [Formats WebP/JPEG](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html#webp), [ajustement sans déformation `ImageOps.pad`](https://pillow.readthedocs.io/en/stable/reference/ImageOps.html#PIL.ImageOps.pad), [redimensionnement](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.resize). La documentation stable consultée s'identifie 12.3.0. |
| Poppler | 26.04.0 | [Projet officiel](https://poppler.freedesktop.org/) et manuel installé `man pdftoppm`; rendu PNG complet des pages et comparaison indépendante via `pdftotext`. |
| Ruff | 0.16.10 | [Formatter officiel](https://docs.astral.sh/ruff/formatter/), [release exacte](https://github.com/astral-sh/ruff/releases/tag/0.16.10); outil de validation temporaire, installé sous `/tmp`, sans dépendance ajoutée au site. |

## Source externe à aligner ultérieurement

Le générateur éditable historique est
`/Users/tony/Documents/Resume/generate.mjs` (SHA-256 inspecté
`232b6366a6864d581ca4a67ce2f692bdc54a878b192ae08ad63d2792cb3da6c0`).
Il utilise l'ancienne photo par défaut et des contenus qui ont évolué depuis le
PDF public. Il est resté inchangé. Une prochaine régénération complète du CV
devra aligner cette source et ses variantes EN/FR avec le portrait retenu, après
vérification des contenus, pour éviter de réintroduire l'ancienne photo.

Cette opération ne constitue aucun déploiement ni publication du site.

## Correction visuelle du site : portrait sans fond ni cadre

Les captures du propriétaire ont ensuite montré le fond photographique et le
cadre arrondi indésirables. Le site utilise maintenant le JPG original inchangé
avec un masque alpha séparé, sans bordure, fond de photo, ombre ni masque en arche.
Le CV reste celui vérifié ci-dessus; cette correction concerne la présentation
du site.

Imagegen a produit un détourage transparent à partir du JPG source, sans autre
image de référence. Fichier retourné :
`/Users/tony/.codex/generated_images/01a0fb7e-62c9-7fe1-be0a-e0a15143e7a9/exec-fc89b514-76df-48d0-aa74-b9a1fcd6e730.png`
(1154 × 1363, canal alpha réel). Seul son alpha est utilisé par le site.
La revue indépendante a confirmé qu'un redimensionnement vers 880 × 1040 suffit
(écart de ratio 0,060 %), sans translation, rotation ou érosion. Les valeurs
alpha >=250 sont ramenées à255 pour corriger la légère transparence intérieure
du détourage; les autres valeurs de bord restent inchangées. Aucun pixel RGB
du visage original n'est réécrit.

Prompt utilisé, `transparent_background: true` :

> Use case: background-extraction. Edit target: the supplied existing portrait photograph of Anthony Paquet, to be used in his website. Remove ONLY the out-of-focus photographic background, leaving a genuinely transparent alpha background. Preserve the entire visible person EXACTLY as in the source: same face, facial features, expression, age, natural skin texture, pores and beard stubble, eyes, teeth, hairstyle and fine flyaway windswept strands, skin tone, original lighting, dark jacket and white shirt. Do not repaint, beautify, smooth, blur, sharpen, tan, retouch or regenerate any part of the subject. No new body/clothing outside the original frame. Keep the original composition, portrait aspect ratio and framing, without any rounded mask, arch, border, shadow, added background, text or decoration. Make a precise natural hair-edge cutout with no gray halo. Transparent background is mandatory. Output only the same original person with the former backdrop removed.

Actif livré : `public/images/anthony-paquet-cutout-mask.webp`, 880 × 1040,
50082 octets, WebP sans perte, SHA-256
`884d2350e23f39918cd39bd4425aff98261585550d3d98a22083be253e6428a0`.
Le SHA du JPG reste `0f0247a0d005fb6a7f53969c03c909c34db33a5afa6cb44050a863ba5d36a811`.
Le masque et le JPG pèsent ensemble 159853 octets. Ce choix augmente les octets
image par rapport au WebP initial pour conserver exactement la photo originale.

Reproduction avec Sharp 0.34.5, déjà installé par Next, sans nouvelle dépendance :

```sh
node scripts/prepare-portrait-mask.mjs \
  --input /chemin/vers/le-detourage-transparent.png \
  --portrait public/images/anthony-paquet-pitch.jpg \
  --output public/images/anthony-paquet-cutout-mask.webp \
  --opaque-threshold 250
```

Sources consultées le 2 octobre 2026 : [Sharp extractChannel et joinChannel](https://sharp.pixelplumbing.com/api-channel/),
[WebP sans perte](https://sharp.pixelplumbing.com/api-output/#webp),
[CSS mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image).
Les méthodes sont présentes dans la version installée. `Hero` reçoit le chemin
du masque et les dimensions du catalogue; CSS utilise explicitement le canal
alpha avec les propriétés standard et WebKit. Les captures finales desktop/mobile
et le décodage du masque ont été vérifiés dans Chrome. À 2×, quelques mèches ont
un fin liseré gris déjà mêlé aux pixels JPEG; la revue déconseille une érosion
globale qui supprimerait les cheveux fins. Le résultat a été inspecté sur fonds
clair et sombre. Diagnostic d'intégration : 0 valeur RGB source changée.
