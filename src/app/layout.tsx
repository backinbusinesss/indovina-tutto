import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/bricolage-grotesque'
import './globals.css'

export const metadata: Metadata = {
  title: 'Indovina Tutto',
  description: 'Il quiz su tutto di carlarcade.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
