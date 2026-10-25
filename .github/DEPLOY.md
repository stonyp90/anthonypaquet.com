# Deploy setup for anthonypaquet.com

Static-export Next.js site (`npm run build` → `out/`), served by a **Cloudflare Worker with static assets** (`wrangler.jsonc`, `worker/index.js`). DNS for `anthonypaquet.com` is served by **Cloudflare**; the domain is registered at GoDaddy with its nameservers pointed at Cloudflare. HTTPS certificates are issued and renewed automatically by Cloudflare.

## Architecture

```
GoDaddy (registrar) ──NS──▶ Cloudflare DNS zone: anthonypaquet.com
                                 ├─ www.anthonypaquet.com ─▶ Worker custom domain ─▶ static assets (out/)
                                 └─ anthonypaquet.com     ─▶ Worker custom domain ─301─▶ CANONICAL_HOST
GitHub Actions (push to main) ── wrangler deploy ─▶ Worker "anthonypaquet-com"
```

## What ships in this repo

| File | Purpose |
|---|---|
| `wrangler.jsonc` | Worker name, custom domains (`routes`), `CANONICAL_HOST`, and the `out/` assets directory. |
| `worker/index.js` | Redirects any non-canonical host to `CANONICAL_HOST`, otherwise serves the static assets. |
| `.github/workflows/deploy.yml` | Builds the static export, runs `wrangler deploy`, then smoke-checks `SITE_URL`. Runs on push to `main` or manual dispatch. |

## Configuration

Set at `https://github.com/stonyp90/anthonypaquet.com/settings/secrets/actions`.

**Secrets**
- `CLOUDFLARE_API_TOKEN` — API token from the *Edit Cloudflare Workers* template, scoped to this account and the `anthonypaquet.com` zone
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID (dashboard sidebar)

**Variables**
- `SITE_URL` — canonical URL used by the smoke check (e.g. `https://www.anthonypaquet.com`)

If any value is missing, the workflow skips the deploy with a warning instead of failing.

## One-time Cloudflare setup

1. Verify the Cloudflare account email (Workers refuses deploys until it is verified).
2. Dashboard → **Add a domain** → `anthonypaquet.com` (Free plan). Note the two assigned nameservers.
3. At **GoDaddy** → Domains → anthonypaquet.com → DNS → Nameservers → *I'll use my own nameservers* → enter the two Cloudflare nameservers.
4. Deploy locally once (creates the Worker and attaches both custom domains with certificates):

   ```bash
   npx wrangler login
   npm run build && npx wrangler deploy
   ```

5. SSL/TLS → Edge Certificates → enable *Always Use HTTPS*.

## Rolling back

```bash
git revert HEAD
git push origin main
```

Or, instantly: `npx wrangler rollback` (or Workers & Pages → anthonypaquet-com → Deployments → *Rollback*).
