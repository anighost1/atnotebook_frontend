"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { login } from "@/apiCalls/auth"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { isExpired } from 'react-jwt'
import { Loader2Icon } from "lucide-react"

const formFields = [
  { id: "username", label: "Username", type: "text", placeholder: "abc69" },
  { id: "password", label: "Password", type: "password" },
]

export function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState(
    Object.fromEntries(formFields.map((field) => [field.id, ""]))
  )
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('access')

    if (token && !isExpired(token)) {
      router.replace('/dashboard')
    }
  }, [router])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await login(formData)
      const accessToken = response?.data?.access
      const refreshToken = response?.data?.refresh

      if (!accessToken || !refreshToken) {
        throw new Error("Missing access or refresh token in response");
      }

      Cookies.set('access', accessToken)
      Cookies.set('refresh', refreshToken)

      router.push('/dashboard')

    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {formFields.map(({ id, label, type, placeholder }) => (
                <div key={id} className="grid gap-3">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (<span className="flex flex-row gap-2 justify-center items-center">
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </span>) : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
