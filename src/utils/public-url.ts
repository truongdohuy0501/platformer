/**
 * Resolves a public/ asset path for the current Vite base URL.
 * Required for GitHub Pages project sites (e.g. /platformer/).
 */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const segment = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${segment}`;
}
