import type { MetadataRoute } from 'next'
import { assetUrl } from '@/lib/asset'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetUrl('app/'),
    name: 'Indovina Tutto',
    short_name: 'Indovina',
    description: 'Il quiz su tutto: bandiere, capitali, sagome dei paesi, loghi e molto altro. Un gioco carlarcade.',
    start_url: assetUrl('app/'),
    scope: assetUrl(''),
    display: 'standalone',
    orientation: 'portrait',
    lang: 'it',
    dir: 'ltr',
    background_color: '#0B0F2A',
    theme_color: '#0B0F2A',
    categories: ['games', 'education', 'trivia'],
    icons: [
      { src: assetUrl('icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: assetUrl('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: assetUrl('icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Sfida del giorno', url: assetUrl('app/sfida/'), icons: [{ src: assetUrl('icons/icon-192.png'), sizes: '192x192' }] },
      { name: 'Mix Tutto', url: assetUrl('app/gioca/?c=mix'), icons: [{ src: assetUrl('icons/icon-192.png'), sizes: '192x192' }] },
    ],
  }
}
