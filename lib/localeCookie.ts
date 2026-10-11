/* The language picked with the EN/FR switch. worker/index.js reads the same
   cookie when someone opens the English home page, so this choice beats the
   browser language on every later visit. Not copy: the separators below are
   cookie syntax. */

export const LOCALE_COOKIE = 'lang'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export function rememberLocale(code: 'en' | 'fr') {
  const attributes = [`${LOCALE_COOKIE}=${code}`, 'Path=/', `Max-Age=${ONE_YEAR_SECONDS}`, 'SameSite=Lax']
  if (window.location.protocol === 'https:') attributes.push('Secure')
  document.cookie = attributes.join('; ')
}
