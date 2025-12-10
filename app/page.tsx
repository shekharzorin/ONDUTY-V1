import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { ScreenshotGallery } from "@/components/sections/screenshots"
import { HowItWorks } from "@/components/sections/how-it-works"
import { ContactSection } from "@/components/sections/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <ScreenshotGallery />
      <HowItWorks />
      <ContactSection />
    </div>
  )
}
