import { Features } from "@/components/sections/features"
import { Check } from "lucide-react"
import Image from "next/image"

export default function FeaturesPage() {
  return (
    <div className="pt-10">
        <div className="container mx-auto px-6 text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Powerful Features</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Discover why OnDuty is the preferred choice for businesses worldwide.
            </p>
        </div>
        
        <Features />

        <div className="container mx-auto px-6 py-24">
            <div className="bg-gray-50 rounded-[3rem] p-12 md:p-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">More than just attendance</h3>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            We provide a comprehensive suite of tools to manage your workforce efficiently. 
                            From scheduling to payroll integration, we have got you covered.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Face Recognition", "Geofencing", "Leave Management", 
                                "Shift Scheduling", "Overtime Calculation", "Mobile App",
                                "Payroll Export", "Real-time Notifications"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px] relative overflow-hidden group">
                        <Image 
                            src="/images/dashboard.png" 
                            alt="Detailed Feature UI" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
