
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setServerError("Please enter email and password.")
      return
    }

    try {
      setLoading(true)
      setServerError("")

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        setServerError(error.message || "Sign in failed.")
        return
      }

      console.log("Sign in successful:", data)

      router.push("/")
      router.refresh()

    } catch (err) {
      console.error(err)
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async() =>{
   const data = await authClient.signIn.social({
    provider: "google",
})
console.log(data);

}

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">

            {serverError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>

            
          </CardFooter>
        </form>
        <Button className='mx-4' onClick={handleGoogleSignIn}>Sign In With google</Button>
        <p className="text-center text-sm mb-4 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground underline"
              >
                Sign Up
              </Link>
            </p>
      </Card>
    </main>
  )
}
