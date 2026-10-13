import Hero from '@/components/Hero'
import About from '@/components/About'
import DevelopmentCycle from '@/components/DevelopmentCycle'
import Services from '@/components/Services'
import Experience from '@/components/Experience'
import Certifications from '@/components/Certifications'
import PersonalProjects from '@/components/PersonalProjects'
import Footer from '@/components/Footer'
import MotionProvider from '@/components/MotionProvider'
import SiteNavigation from '@/components/SiteNavigation'

/** Ordered composition keeps ventures independent from the professional record. */
export default function Sections() {
  return (
    <MotionProvider>
      <SiteNavigation />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        <Hero />
        <div data-reveal><About /></div>
        <div data-reveal><DevelopmentCycle /></div>
        <div data-reveal className="section-reveal section-reveal--services"><Services /></div>
        <div data-reveal className="section-reveal section-reveal--experience"><Experience /></div>
        <div data-reveal className="section-reveal section-reveal--certifications"><Certifications /></div>
        <div data-reveal className="section-reveal section-reveal--projects"><PersonalProjects /></div>
      </main>
      <Footer />
    </MotionProvider>
  )
}
