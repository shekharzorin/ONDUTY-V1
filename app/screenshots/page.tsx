import { ScreenshotGallery } from "@/components/sections/screenshots"

export default function ScreenshotsPage() {
  return (
    <div className="pt-10">
      <div className="container mx-auto px-6 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Product Interface</h1>
      </div>
      <ScreenshotGallery />
    </div>
  )
}
