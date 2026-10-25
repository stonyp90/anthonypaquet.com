# ScaleForge as the latest Experience entry

## Owner direction

On October 25, 2026, the owner asked to place ScaleForge in the Experience
section as the latest role, with the title **Builder** and duration **2 years**.
GoNota, Tablix, Control Craft, Ursly, and OfferDuel belong within that role.
The former standalone studio and products section is superseded by this
composition.

The owner supplied the duration. No exact starting month or date is inferred.
The textual company name is **ScaleForge**. Its approved yellow Empreinte
wordmark retains its original **SCALEFORGED** lettering.

## Content contract

| Field | Current presentation |
| --- | --- |
| Latest experience | ScaleForge |
| Role title | Builder |
| Duration | 2 years |
| Location | Québec, Canada |
| Studio website | https://scaleforged.io |
| Approved logo | `/images/logos/scaleforge-empreinte.svg` |
| Products in the role | GoNota, Tablix, Control Craft, Ursly, OfferDuel |

The experience data is maintained in `lib/data.ts`; localized presentation copy
is in `lib/content/en.ts` and `lib/content/fr.ts`. Product names, descriptions,
and verified destinations remain in `lib/projects.ts` and are displayed within
the ScaleForge experience. Metadata, structured data, and `public/llms.txt`
identify the same current role.

## Product identity boundaries

- **GoNota** links to `https://gonota.ca` and remains a product within the studio.
  It is no longer represented as Anthony’s current primary organization in the
  Person structured data.
- **Tablix** links to `https://tablix.ca` and retains its legal document
  intelligence positioning.
- **Control Craft** replaces the former Lunorive name in current presentation.
  Its verified destination is `https://controlcraft.io`. Copy describes art
  inspired by places, events, and memories without asserting checkout readiness.
- **Ursly** links to `https://ursly.io` and retains its exploratory interface
  positioning.
- **OfferDuel** uses the spelling confirmed by the owner’s subsequent verbal
  correction and the current `stonyp90/offerduel` repository. Its canonical
  destination is `https://offerduel.io`. The product is presented as explorable
  3D industry worlds with local negotiation demonstrations. No ordering,
  payment, or merchant-contact capability is asserted. No logo is added because
  a canonical brand asset has not been verified.

### OfferDuel identity evidence

Checked against `stonyp90/offerduel` default-branch commit
`d60970cfc638ae1dfc5ee79e5c948c0ffc45b107`:

- [`README.md`](https://github.com/stonyp90/offerduel/blob/d60970cfc638ae1dfc5ee79e5c948c0ffc45b107/README.md)
  names the application **OfferDuel / Le Salon Worlds** and describes industry
  worlds and a local negotiation demonstration.
- [`site.config.json`](https://github.com/stonyp90/offerduel/blob/d60970cfc638ae1dfc5ee79e5c948c0ffc45b107/site.config.json)
  sets `canonicalHost` to `offerduel.io`.
- [`docs/RUNBOOK.md`](https://github.com/stonyp90/offerduel/blob/d60970cfc638ae1dfc5ee79e5c948c0ffc45b107/docs/RUNBOOK.md)
  documents the canonical public host and the public adapter’s demonstration
  boundary. Site availability was not independently verified during this copy
  correction because the web fetch was unavailable.

The canonical product ID is `offerduel`. The current experience composition,
ScaleForge identity, and other product entries are unchanged by this correction.

## Metadata and documentation changes

`components/SiteDocument.tsx` now identifies the current role as Builder at
ScaleForge, describes the two-year duration, and associates the Person’s
`worksFor` entry with ScaleForge and the approved yellow logo. The studio’s
five product brands remain in its Organization data.

`public/llms.txt` presents ScaleForge under Current Experience and nests its
products beneath the Builder role. `README.md` follows the same hierarchy and
describes Bespoke Labs and CREE8 as previous engagements rather than current
roles. The role’s duration is expressed as text; no start date is manufactured.

## Verification and publication

This record documents the owner’s requested structure and the source contract.
It does not certify a deployment. Changes require the normal repository build
and relevant navigation, responsive-layout, and content checks before release.
At this edit’s handoff, publication was blocked because the deployment
environment did not provide `CLOUDFLARE_API_TOKEN`. That credential is not stored
in this repository.
