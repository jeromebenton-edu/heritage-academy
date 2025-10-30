"use client"

import * as React from "react"
import clsx from "clsx"

type Variant = "info" | "success" | "warning" | "destructive"

export function Alert({
  title,
  children,
  variant = "info",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string; variant?: Variant }) {
  const colors: Record<Variant, string> = {
    info: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
    success: "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200",
    warning: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
    destructive: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
  }
  return (
    <div
      className={clsx(
        "rounded-md border p-3 text-sm",
        colors[variant],
        className
      )}
      {...props}
    >
      {title ? <div className="font-semibold mb-1">{title}</div> : null}
      {children}
    </div>
  )
}

