import type { Metadata } from 'next'
import {
  CategoryShowcase,
  DailyTeaser,
  Faq,
  FinalCta,
  Footer,
  GemsExplainer,
  Hero,
  HowItWorks,
  InstallGuide,
  LandingNav,
} from '@/landing/sections'

export const metadata: Metadata = {
  title: { absolute: 'Indovina Tutto — il quiz su bandiere, capitali, loghi e molto altro' },
}

export default function Landing() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <CategoryShowcase />
        <HowItWorks />
        <DailyTeaser />
        <GemsExplainer />
        <InstallGuide />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
