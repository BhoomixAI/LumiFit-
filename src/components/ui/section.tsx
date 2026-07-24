import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  py?: "none" | "sm" | "md" | "lg" | "xl"
  bg?: "default" | "muted" | "dark" | "glow"
}

export function Section({
  className,
  as: Component = "section",
  py = "md",
  bg = "default",
  ...props
}: SectionProps) {
  const pyClasses = {
    none: "py-0",
    sm: "py-8 md:py-12",
    md: "py-12 md:py-20",
    lg: "py-16 md:py-28",
    xl: "py-20 md:py-36",
  }

  const bgClasses = {
    default: "bg-background text-foreground",
    muted: "bg-muted/30 text-foreground",
    dark: "bg-black text-white dark:bg-zinc-950",
    glow: "bg-background relative overflow-hidden before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-full before:max-w-7xl before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
  }

  return (
    <Component
      className={cn(pyClasses[py], bgClasses[bg], className)}
      {...props}
    />
  )
}
