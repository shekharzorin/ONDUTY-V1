import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative w-14 h-14">
        <Image 
          src="/images/logo.png" 
          alt="OnDuty Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors">OnDuty</span>
    </Link>
  )
}
