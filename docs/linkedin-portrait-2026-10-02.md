# LinkedIn portrait framing — October 2, 2026

> Superseded on October 11, 2026: the portrait of record is now the t-shirt
> photograph, uploaded as is. See `portrait-evidence-2026-10-11.md`.

Owner confirmed the request concerns LinkedIn's circular profile photograph.
The output is a separate upload file; the website, CV and LinkedIn profile are
not changed by this export.

## Delivered files

- `output/portraits/AnthonyPaquet-LinkedIn-final.png`: opaque square PNG,
  1280×1280, 1564106 bytes. SHA-256
  `c61503465ee0b434f4a1044b373a3ec26ad7efb0cd275d340645fd9cd3560e68`.
- `output/portraits/AnthonyPaquet-LinkedIn-final-apercu-rond.png`: circular preview.
- `output/portraits/AnthonyPaquet-LinkedIn-apercu-400.png`: circular preview at400px.
- `output/portraits/AnthonyPaquet-LinkedIn-final.png.json`: geometry and RGB report.

The 880×1040 pitch photograph stays at its original size, centered at(200,120).
The existing imagegen alpha cutout is reused. An independent geometric check
measured approximately91px clearance between the head (including fine hair)
and the inscribed circle. The final square and circular preview were inspected.

The first square export left the original photograph's lower clothing edge
visible. A built-in imagegen edit extends only the lower clothing for a natural
circular crop. The generated head is never used: the first980 rows of the
original square export are restored, and the remaining original subject is
overlaid with its existing alpha. A64px transition below the original image
edge(y1160) harmonizes the new lower clothing with the original edge colors.
The original subject's fully opaque pixels remain identical:545439 pixels
compared, zero RGB values changed. No source photograph is overwritten.

## Reproduce

Node22.16.0 and Sharp0.34.5, already installed with Next15.5.9. No dependency
upgrade. Paths, canvas size, palette token, protected region and transition are
CLI options; the backdrop uses`--color-paper` from the existing CSS palette.

```sh
node scripts/export-linkedin-portrait.mjs \
  --extension output/portraits/linkedin-clothing-extension-master.png \
  --protected-top 980 \
  --extension-blend-height 64 \
  --output output/portraits/AnthonyPaquet-LinkedIn-final.png
```

The script verifies dimensions, upload size, mask geometry and unchanged original
opaque RGB pixels before writing its evidence report. A preliminary existence
check failed before the export. Final export and targeted ESLint pass.

## Imagegen provenance

Built-in tool mode; no API/CLI fallback. Input edit target:
`output/portraits/AnthonyPaquet-LinkedIn.png`. Returned file:
`/Users/tony/.codex/generated_images/01a0fb7e-62c9-7fe1-be0a-e0a15143e7a9/exec-49cb46f8-f595-4327-a9b3-b96e69e5a10b.png`,
copied to`output/portraits/linkedin-clothing-extension-master.png`.
`transparent_background:false`.

Prompt:

> Use case: outpainting. Edit target: the supplied square portrait canvas. Intended use: LinkedIn profile photo cropped to a circle. KEEP THE EXISTING HEAD AND FACE EXACTLY UNCHANGED, including its position, size, expression, original pores/stubble, eye shape, smile, teeth, windswept hair, natural warm skin tone and original lighting. Do not retouch, regenerate, beautify, smooth, tan or modify the face or hair at all. Maintain the same square canvas and cream solid background (same background color as the supplied image). The portrait currently ends with an unnatural hard horizontal cut across the jacket and white shirt near the bottom, leaving an empty cream band below. ONLY extend the existing dark suit jacket, white shirt collar and shoulders downward seamlessly to the bottom of the canvas, filling that missing lower 10% while matching the clothing already visible. Do not invent extra arms, accessories, new garments or new photographic backgrounds. All editing should be confined to the lowest 15% of the image, beneath the chin. No border, round mask, decorations, text, watermark, props or logos. The entire head must remain exactly where it is with all the existing safe margin for a circular profile crop.

## Official guidance checked October 2, 2026

- [LinkedIn upload specifications](https://www.linkedin.com/help/linkedin/answer/a549049):
  PNG/JPG, at least400×400, maximum8MB.1280px/1.56MB fits these limits.
- [LinkedIn photo adjustment](https://www.linkedin.com/help/linkedin/answer/a545811):
  crop, position and size can be adjusted after selecting an upload file.
- [Sharp composite](https://sharp.pixelplumbing.com/api-composite/) and
  [PNG output](https://sharp.pixelplumbing.com/api-output/#png): methods exist
  in installed0.34.5; source pixels are retained without another JPEG encode.

No upload or live LinkedIn crop has been performed. The circular artifact is a
local preview of the default circular crop; zooming in can cut the hair again.
