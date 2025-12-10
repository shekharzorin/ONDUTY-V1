"use client"

import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Employee Tracking",
    subheadline: "Monitor your field staff's real-time location",
    description: "Know exactly where your team is during work hours and ensure they are at the right client site with our advanced GPS tracking system.",
    image: "/images/clay_tracking.png", 
    color: "bg-blue-50 text-blue-600",
    button: "Track Locations",
  },
  {
    title: "Smart Attendance",
    subheadline: "Eliminate time theft with facial verification",
    description: "Allow employees to clock in with a selfie. Our facial recognition technology verifies identity instantly, preventing buddy punching.",
    image: "/images/clay_attendance.png",
    color: "bg-brand-50 text-brand-600",
    button: "View Attendance",
  },
  {
    title: "Detailed reporting & analytics",
    subheadline: "Transform time tracking data into actionable insights",
    description: "Gain valuable insights into employee productivity, project efficiency, and resource allocation. Make informed decisions based on real-time data, not just guesswork.",
    image: "/images/clay_reports.png",
    color: "bg-orange-50 text-orange-600",
    button: "Download Reports",
  },
  {
    title: "Offline Sync",
    subheadline: "Seamless data synchronization, anywhere",
    description: "No internet? No problem. The app works perfectly offline and automatically syncs all data when the connection is restored.",
    image: "/images/clay_sync.png", 
    color: "bg-green-50 text-green-600", 
    button: "Learn More",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to manage your workforce
          </h2>
          <p className="text-xl text-gray-500">
            Powerful features designed to streamline your operations and boost productivity.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 w-full relative group">
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-white">
                   <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white opacity-50" />
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="relative w-full h-auto transform transition-transform duration-700 hover:scale-105"
                    />
                  </div>
              </div>

              <div className="flex-1 space-y-6">
                <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  {feature.subheadline}
                </p>
                <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                  {feature.description}
                </p>
                
                <div className="pt-4">
                  <button className="group flex items-center gap-2 text-brand-600 font-semibold text-lg hover:text-brand-700 transition-colors">
                    {feature.button}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
