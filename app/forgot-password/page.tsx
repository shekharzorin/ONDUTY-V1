import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">
        <div className="flex flex-col items-center">
          <Logo />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your email and we'll send you a link to reset your password</p>
        </div>
        <form className="mt-8 space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required className="mt-1" placeholder="name@company.com" />
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-brand-600 hover:bg-brand-700">
            Send Reset Link
          </Button>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
