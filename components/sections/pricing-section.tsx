"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Trial Plan",
    price: "₹0",
    period: "/1 week trial",
    features: [
      { name: "Visit / Task management", included: true },
      { name: "Report management", included: true },
      { name: "Client management", included: true },
      { name: "Live tracking", included: true },
      { name: "Add Employees", included: true },
      { name: "Admin access", included: true },
      { name: "Employee Isolation", included: true },
      { name: "Employee Tracking History", included: true },
    ],
    buttonText: "Start Free Trial",
    highlight: false,
    borderColor: "border-green-400",
  },
  {
    name: "Silver Plan",
    price: "₹499",
    period: "/month",
    features: [
      { name: "Visit / Task management", included: true },
      { name: "Report management", included: true },
      { name: "Client management", included: false },
      { name: "Live tracking", included: false },
      { name: "Add Employees", included: true },
      { name: "Admin access", included: true },
      { name: "Employee Isolation", included: true },
      { name: "Employee Tracking History", included: false },
    ],
    buttonText: "Choose Silver",
    highlight: false,
    borderColor: "border-gray-200",
  },
  {
    name: "Gold Plan",
    price: "₹999",
    period: "/month",
    features: [
      { name: "Visit / Task management", included: true },
      { name: "Report management", included: true },
      { name: "Client management", included: false },
      { name: "Live tracking", included: true },
      { name: "Add Employees", included: true },
      { name: "Admin access", included: true },
      { name: "Employee Isolation", included: true },
      { name: "Employee Tracking History", included: true },
    ],
    buttonText: "Choose Gold",
    highlight: true,
    borderColor: "border-yellow-400",
  },
  {
    name: "Diamond Plan",
    price: "₹1999",
    period: "/month",
    features: [
      { name: "Visit / Task management", included: true },
      { name: "Report management", included: true },
      { name: "Client management", included: true },
      { name: "Live tracking", included: true },
      { name: "Add Employees", included: true },
      { name: "Admin access", included: true },
      { name: "Employee Isolation", included: true },
      { name: "Employee Tracking History", included: true },
    ],
    buttonText: "Choose Diamond",
    highlight: false,
    borderColor: "border-blue-400",
  },
]

export function PricingSection() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Plan</h2>
          <p className="text-gray-500">Upgrade your plan to unlock powerful premium features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div 
                key={plan.name}
                className={`relative rounded-xl p-6 border-2 ${plan.borderColor} bg-white transition-transform hover:-translate-y-1 duration-300 shadow-sm hover:shadow-lg`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="mt-0.5">
                        <Check className="h-5 w-5 text-green-600 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="mt-0.5">
                         <X className="h-5 w-5 text-red-500 stroke-[3]" />
                      </div>
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-900" : "text-red-500"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="secondary"
                className="w-full py-6 text-base font-semibold rounded-lg bg-gray-100/80 hover:bg-gray-200 text-gray-900 transition-colors"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
