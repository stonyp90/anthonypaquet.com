# CV — sources et régénération

Les PDF du CV servis par le site sont générés depuis les sources HTML de ce dossier.
**Une seule commande pour tout régénérer :**

```sh
./cv/build.sh
```

- `cv-en.html` → `public/AnthonyPaquet.pdf`
- `cv-fr.html` → `public/AnthonyPaquet-FR.pdf`
- `cv-leloir.html` → `cv/dist/CV-Anthony-Paquet-Leloir-MFA-FR.pdf` (version dédiée, non publiée)

Prérequis : Chrome ou Chromium (le script le détecte; sinon `CHROME=/chemin ./cv/build.sh`).
Chaque PDF doit faire exactement **2 pages** lettre — le script l'affiche après génération.
Le bouton « Télécharger le CV » du site choisit la langue via `useLocale()` dans `components/Hero.tsx`.

## Provenance

Les HTML dérivent des fichiers générés le 6 oct. 2026 par le générateur d'Anthony
(`~/Documents/Resume/generate.mjs` sur son Mac), édités le 2 nov. 2026.

## Règles d'édition (décisions du 2 nov. 2026 — ne pas régresser)

1. **Aucune mention de Nota / GoNota** (expérience retirée); Bespoke Labs en tête.
2. **Aucune section « Projets personnels »** (Diaspor, SST Diamantex retirés).
3. Le français est la traduction du générateur d'origine, pas une retraduction.
4. **À partir de SSENSE** : expériences seulement listées (poste, entreprise, dates, lieu) —
   **pas de paragraphe de description** (`.ctx` retiré pour SSENSE, Dormakaba, Vanderlande ×2,
   PetalMD, CGI, Logicale). Bespoke, CREE8, Vidéotron et Fairstone gardent les leurs.
5. Mise en page aérée : interligne relevé (EN 1.50 / FR 1.40), marges entre expériences 22 px,
   colonne latérale (`.col-side section`) espacée à 28 px — viser ~90 % de remplissage par page.
6. Portrait : la photo plage/surf (`anthony-paquet-pitch.jpg` de ce dossier, extraite du PDF
   d'origine) — **pas** le portrait studio serré. Le script `scripts/update-cv-portrait.py`
   n'est plus nécessaire pour ces PDF.
7. Version Leloir : CV officiel français exact + mot-clé **DevSecOps** saupoudré
   (sous-titre, résumé, compétences, Bespoke, CREE8, Vidéotron) + « infonuagiques » au résumé.
   Rien d'autre n'est réécrit dans cette version.
