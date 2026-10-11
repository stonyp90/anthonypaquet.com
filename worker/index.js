// Serves the static export from ./out, redirects non-canonical custom domains
// (e.g. the apex) to CANONICAL_HOST, and picks the page language for visitors
// who land on the English root. *.workers.dev is left alone so previews keep
// working.
//
// Language: a French browser that opens / is sent to /fr/. Everyone else gets
// English. A choice made with the EN/FR switch (the `lang` cookie, or a
// ?lang=en|fr link) always wins over the browser, and /fr/ is never redirected,
// so an explicit URL is respected.

const LOCALES = ["en", "fr"];
const LANG_COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;
const ENGLISH_ROOTS = new Set(["/", "/index.html"]);
const FRENCH_ROOTS = new Set(["/fr", "/fr/", "/fr/index.html"]);
const VARY = "Accept-Language, Cookie";

// The supported locale the browser ranks highest, or null when it names none.
export function preferredLocale(acceptLanguage) {
  if (!acceptLanguage) return null;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q === undefined ? 1 : Number(q.slice(2));
      return { locale: tag.trim().toLowerCase().split("-")[0], weight, index };
    })
    .filter((entry) => entry.locale && Number.isFinite(entry.weight) && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return ranked.find((entry) => LOCALES.includes(entry.locale))?.locale ?? null;
}

// The locale the visitor picked with the EN/FR switch, or null.
export function chosenLocale(cookieHeader) {
  const match = (cookieHeader ?? "").match(/(?:^|;\s*)lang=(en|fr)(?:;|$)/);
  return match ? match[1] : null;
}

function languageRedirect(target, extraHeaders = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: target, Vary: VARY, "Cache-Control": "private, no-store", ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonical = env.CANONICAL_HOST;
    if (canonical && url.hostname !== canonical && !url.hostname.endsWith(".workers.dev")) {
      url.hostname = canonical;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const readable = request.method === "GET" || request.method === "HEAD";
    const isEnglishRoot = ENGLISH_ROOTS.has(url.pathname);
    const isFrenchRoot = FRENCH_ROOTS.has(url.pathname);

    // ?lang=en|fr on either home page records the choice, then lands on that
    // language's home page with a clean URL.
    const requested = url.searchParams.get(LANG_COOKIE);
    if (readable && (isEnglishRoot || isFrenchRoot) && LOCALES.includes(requested)) {
      url.searchParams.delete(LANG_COOKIE);
      url.pathname = requested === "fr" ? "/fr/" : "/";
      const secure = url.protocol === "https:" ? "; Secure" : "";
      return languageRedirect(url.toString(), {
        "Set-Cookie": `${LANG_COOKIE}=${requested}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`,
      });
    }

    if (readable && isEnglishRoot) {
      const locale =
        chosenLocale(request.headers.get("Cookie")) ??
        preferredLocale(request.headers.get("Accept-Language")) ??
        "en";
      if (locale === "fr") {
        url.pathname = "/fr/";
        return languageRedirect(url.toString());
      }
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.append("Vary", VARY);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    return env.ASSETS.fetch(request);
  },
};
