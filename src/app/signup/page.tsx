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

function validatePassword(value: string) {
  // better-auth's server default is minPasswordLength: 8 — keep in sync so
  // the form never accepts a password the API rejects.
  if (value.length < 8) return "Password must be at least 8 characters."
  if (!/[a-z]/.test(value)) return "Include a lowercase letter (a-z)."
  if (!/[A-Z]/.test(value)) return "Include an uppercase letter (A-Z)."
  return ""
}

export default function SignUpPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [touched, setTouched] = useState({ password: false, confirm: false })
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordError = validatePassword(password)
  const confirmError = confirm !== password ? "Passwords don't match." : ""

  
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setServerError("");
  setTouched({ password: true, confirm: true });

  if (passwordError || confirmError) return;

  const formData = new FormData(e.currentTarget);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const image = (formData.get("image") as string) || undefined;

  setLoading(true);

  try {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
    });

    if (error) {
      setServerError(error.message || "Couldn't create your account.");
      return;
    }

    console.log("Signup successful:", data);

    router.push("/");
    router.refresh();

  } catch (error) {
    console.error(error);
    setServerError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleGoogleSignUP = async() =>{
   const data = await authClient.signIn.social({
    provider: "google",
})
console.log(data);

}

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
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
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

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
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://..."
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={touched.password && !!passwordError}
              />
              {touched.password && passwordError ? (
                <p className="text-sm text-destructive">{passwordError}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  At least 8 characters, with a-z and A-Z.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                aria-invalid={touched.confirm && !!confirmError}
              />
              {touched.confirm && confirmError && (
                <p className="text-sm text-destructive">{confirmError}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
            
          </CardFooter>
        </form>
        <Button className='mx-4' onClick={handleGoogleSignUP}>Sign Up With Google</Button>
        <p className="text-center text-sm text-muted-foreground mb-4">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-foreground underline">
                Sign in
              </Link>
            </p>
      </Card>
    </main>
  )
}