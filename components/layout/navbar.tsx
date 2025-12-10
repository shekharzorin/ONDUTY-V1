"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-white/80 backdrop-blur-xl border-gray-200/50 py-4 shadow-sm" 
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-lg font-bold transition-colors relative group text-gray-900 hover:text-brand-600"
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full rounded-full",
                "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="rounded-full font-bold text-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 px-6">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-full px-8 py-7 bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 font-bold text-xl transition-all hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-gray-100">
            <div className="flex flex-col gap-8 mt-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-2xl font-semibold text-gray-900 hover:text-brand-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center rounded-full py-6 text-lg font-semibold border-gray-200">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full justify-center bg-brand-500 hover:bg-brand-600 rounded-full py-6 text-lg font-semibold shadow-xl shadow-brand-500/20">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
