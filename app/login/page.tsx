import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">
        <div className="flex flex-col items-center">
          <Logo />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" required className="mt-1" placeholder="name@company.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Input id="password" name="password" type="password" required className="mt-1" placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-brand-600 hover:bg-brand-700">
            Sign in
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
