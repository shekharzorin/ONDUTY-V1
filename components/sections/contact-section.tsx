"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="bg-brand-600 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-900/20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to modernize your workforce?</h2>
                <p className="text-xl text-brand-100 mb-10 leading-relaxed">
                    Join thousands of companies tracking time and attendance with OnDuty. 
                    Start your 14-day free trial today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-white text-brand-600 hover:bg-brand-50 text-lg font-semibold shadow-xl">
                        Get Started Now
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-full border-2 border-brand-400 text-white hover:bg-brand-700 hover:text-white hover:border-transparent text-lg bg-transparent">
                        Contact Sales
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}
