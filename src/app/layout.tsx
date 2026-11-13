import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/bricolage-grotesque'
import './globals.css'
import { assetUrl } from '@/lib/asset'
import { THEME_BOOT_SCRIPT } from '@/lib/theme'

export const metadata: Metadata = {
  title: {
    default: 'Indovina Tutto — il quiz su tutto',
    template: '%s · Indovina Tutto',
  },
  description:
    'Bandiere, capitali, sagome dei paesi, loghi, fiumi, monti e molto altro: oltre 1.900 domande in 12 categorie. Allunga la streak e sfida i tuoi amici. Un gioco carlarcade.',
  applicationName: 'Indovina Tutto',
  icons: {
    icon: [{ url: assetUrl('icon.svg'), type: 'image/svg+xml' }],
    apple: [{ url: assetUrl('icons/apple-touch-icon.png'), sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Indovina Tutto', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B0F2A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="app-backdrop antialiased">{children}</body>
    </html>
  )
}
