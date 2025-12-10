"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const screenshots = [
  { title: "Dashboard Overview", image: "/images/dashboard.png", color: "bg-brand-100" },
  { title: "Mobile Attendance", image: "/images/mobile.png", color: "bg-blue-100" },
  { title: "Team Scheduling", image: "/images/scheduling.png", color: "bg-orange-100" },
]

export function ScreenshotGallery() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider text-brand-600 uppercase bg-brand-50 rounded-full">
                Interface
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Designed for clarity</h2>
            <p className="text-lg text-gray-500">
                Experience an interface that's as beautiful as it is functional. No clutter, just what you need.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenshots.map((shot, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-soft group-hover:shadow-[0_30px_60px_-15px_rgba(139,92,246,0.15)] transition-all duration-500 bg-gray-50 border-4 border-gray-100 aspect-[9/16] md:aspect-[3/4] lg:aspect-[4/5]">
                        <Image 
                            src={shot.image} 
                            alt={shot.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        
                        {/* Caption overlay on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white font-medium">{shot.title}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}
