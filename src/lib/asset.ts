/** Percorso pubblico di un file in `public/`, con il prefisso di GitHub Pages se c'è. */
export function assetUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '')
  return `${base}/${path.replace(/^\/+/, '')}`
}
