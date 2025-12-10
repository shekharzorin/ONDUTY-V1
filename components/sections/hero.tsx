"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-0 pb-20 md:pt-2 md:pb-32 lg:pt-9">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
            <div className="absolute top-0 left-[-20%] w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-brand-300/40 rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        </div>

      <div className="container px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm mb-6 border border-brand-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              The #1 Employee Tracking App
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6 text-balance">
              Track time, attendance & location on autopilot.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed text-balance">
              The smartest way to track employee attendance with GPS, face recognition, and offline support. Join 10,000+ companies using OnDuty today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button size="lg" className="w-full sm:w-auto text-lg h-12 rounded-full px-8 bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 rounded-full px-8 border-2 border-gray-200 hover:bg-gray-50 text-gray-700">
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </motion.div>

          {/* Visual/Illustration */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="flex-1 w-full relative"
          >
             <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-2 border-white bg-white w-200 h-[200 px] md:h-[500px] lg:h-[600px]">
               <Image 
                  src="/images/hero_phone.png" 
                  alt="OnDuty Dashboard Preview" 
                  fill 
                  className="object-contain"
                  priority
               />
             </div>
             
             {/* Floating Elements/Mockups */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[200px]"
             >
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-gray-900">Clocked In</p>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
