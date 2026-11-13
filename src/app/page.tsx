import type { Metadata } from 'next'
import {
  CategoryShowcase,
  DailyTeaser,
  Faq,
  Features,
  FinalCta,
  Footer,
  GemsExplainer,
  Hero,
  HowItWorks,
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
        <HowItWorks />
        <CategoryShowcase />
        <Features />
        <DailyTeaser />
        <GemsExplainer />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
