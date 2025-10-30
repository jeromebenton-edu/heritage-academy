"use client"

import * as React from "react"
import clsx from "clsx"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-9 px-3 py-1.5",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-6 py-2.5",
    }

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-primary-600 text-white hover:bg-primary-700",
      outline:
        "border bg-transparent text-foreground hover:bg-gray-50 dark:hover:bg-gray-800",
      ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
      link: "bg-transparent underline-offset-4 hover:underline",
    }

    return (
      <button
        ref={ref}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

