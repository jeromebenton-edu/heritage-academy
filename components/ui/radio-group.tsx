"use client"

import * as React from "react"
import clsx from "clsx"

export type RadioOption = { label: React.ReactNode; value: any }

export function RadioGroup({
  name,
  options,
  value,
  onValueChange,
  className,
}: {
  name: string
  options: RadioOption[]
  value: any
  onValueChange: (value: any) => void
  className?: string
}) {
  return (
    <div role="radiogroup" className={clsx("space-y-2", className)}>
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            className="h-4 w-4 accent-primary-600"
            checked={value === opt.value}
            onChange={() => onValueChange(opt.value)}
          />
          <span className="text-sm sm:text-base">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

