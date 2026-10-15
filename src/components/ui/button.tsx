import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 font-mono tracking-label whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brand-hover",
        dark: "bg-secondary text-secondary-foreground hover:bg-ink",
        ghost: "text-foreground hover:bg-accent",
        link: "text-primary hover:text-brand-deep hover:underline",
      },
      size: {
        default: "px-5 py-3 text-[15px]",
        sm: "px-4 py-[9px] text-sm",
        nav: "px-3 py-2 text-sm",
        inline: "p-0 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      // Default to type="button" so a Button inside a form never submits by accident.
      {...(asChild ? {} : { type: type ?? "button" })}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
