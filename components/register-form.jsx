"use client"

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
import { useState } from "react"

const formFields = [
  { id: "username", label: "Username", type: "text", placeholder: "abc69" },
  { id: "email", label: "Email", type: "email", placeholder: "m@example.com" },
  { id: "password", label: "Password", type: "password" },
  { id: "first_name", label: "First Name", type: "text" },
  { id: "last_name", label: "Last Name", type: "text" },
  { id: "phone", label: "Phone", type: "number" },
  { id: "address", label: "Address", type: "text" },
]

export function RegisterForm({ className, ...props }) {
  const [formData, setFormData] = useState(
    Object.fromEntries(formFields.map((field) => [field.id, ""]))
  )

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form data:", formData)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
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
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

