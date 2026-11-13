import type { Metadata } from 'next'
import { AppShell } from '@/ui/AppShell'

export const metadata: Metadata = { title: 'Gioca' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
