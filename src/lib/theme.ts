import type { Settings } from '@/engine/progress'

export type Theme = Settings['theme']

export function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const resolved = resolveTheme(theme)
  document.documentElement.dataset.theme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', resolved === 'light' ? '#F6F5FF' : '#0B0F2A')
}

/**
 * Script in linea nel <head>: imposta il tema prima che la pagina venga disegnata,
 * così non c'è il lampo di colore sbagliato. Legge le impostazioni salvate se ci sono.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t='system';try{var s=JSON.parse(localStorage.getItem('indovina-tutto:v1')||'null');if(s&&s.state&&s.state.settings&&s.state.settings.theme)t=s.state.settings.theme}catch(e){}if(t==='system')t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`
