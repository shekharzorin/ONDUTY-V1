"use client"

import { motion } from "framer-motion"
import { Smartphone, UserPlus, FileCheck } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "1. Invite your team",
    description: "Send invites via email or SMS. Team members download the app and join instantly.",
  },
  {
    icon: Smartphone,
    title: "2. Track attendance",
    description: "Staff clock in with GPS or facial recognition. You see their status in real-time.",
  },
  {
    icon: FileCheck,
    title: "3. Export reports",
    description: "Get detailed timesheets and payroll-ready reports whenever you need them.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get started in minutes</h2>
          <p className="text-lg text-gray-500">
            No complex setup or hardware required. Just download and go.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-brand-200 to-gray-200" />

            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex flex-col items-center text-center z-10"
                >
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-brand-100 shadow-sm flex items-center justify-center mb-8 relative group">
                        <div className="absolute inset-0 bg-brand-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <step.icon className="h-10 w-10 text-brand-600 relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs">
                        {step.description}
                    </p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}
