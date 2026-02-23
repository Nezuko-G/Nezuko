"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpRight } from "lucide-react"
import { loginSchema, LoginFormData } from "../schemas/auth-schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6" noValidate>
      <div className="space-y-3">
        <label htmlFor="email" className="text-sm font-semibold tracking-wide text-zinc-300 ml-2">
          EMAIL ADDRESS
        </label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...register("email")}
          error={!!errors.email}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500 ml-2 font-medium" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="password" className="text-sm font-semibold tracking-wide text-zinc-300 ml-2">
          PASSWORD
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={!!errors.password}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500 ml-2 font-medium" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4 flex gap-2 w-full sm:w-auto self-start">
        {isSubmitting ? "AUTHENTICATING..." : "SECURE LOGIN"}
        {!isSubmitting && <ArrowUpRight className="h-5 w-5" />}
      </Button>
    </form>
  )
}