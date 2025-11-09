import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "shadcn-:inline-flex shadcn-:items-center shadcn-:justify-center shadcn-:gap-2 shadcn-:whitespace-nowrap shadcn-:rounded-md shadcn-:text-sm shadcn-:font-medium shadcn-:transition-all shadcn-:disabled:pointer-events-none shadcn-:disabled:opacity-50 shadcn-:[&_svg]:pointer-events-none shadcn-:[&_svg:not([class*=size-])]:size-4 shadcn-:shrink-0 shadcn-:[&_svg]:shrink-0 shadcn-:outline-none shadcn-:focus-visible:border-ring shadcn-:focus-visible:ring-ring/50 shadcn-:focus-visible:ring-[3px] shadcn-:aria-invalid:ring-destructive/20 shadcn-:dark:aria-invalid:ring-destructive/40 shadcn-:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "shadcn-:bg-primary shadcn-:text-primary-foreground shadcn-:hover:bg-primary/90",
        destructive:
          "shadcn-:bg-destructive shadcn-:text-white shadcn-:hover:bg-destructive/90 shadcn-:focus-visible:ring-destructive/20 shadcn-:dark:focus-visible:ring-destructive/40 shadcn-:dark:bg-destructive/60",
        outline:
          "shadcn-:border shadcn-:bg-background shadcn-:shadow-xs shadcn-:hover:bg-accent shadcn-:hover:text-accent-foreground shadcn-:dark:bg-input/30 shadcn-:dark:border-input shadcn-:dark:hover:bg-input/50",
        secondary:
          "shadcn-:bg-secondary shadcn-:text-secondary-foreground shadcn-:hover:bg-secondary/80",
        ghost:
          "shadcn-:hover:bg-accent shadcn-:hover:text-accent-foreground shadcn-:dark:hover:bg-accent/50",
        link: "shadcn-:text-primary shadcn-:underline-offset-4 shadcn-:hover:underline",
      },
      size: {
        default: "shadcn-:h-9 shadcn-:px-4 shadcn-:py-2 shadcn-:has-[>svg]:px-3",
        sm: "shadcn-:h-8 shadcn-:rounded-md shadcn-:gap-1.5 shadcn-:px-3 shadcn-:has-[>svg]:px-2.5",
        lg: "shadcn-:h-10 shadcn-:rounded-md shadcn-:px-6 shadcn-:has-[>svg]:px-4",
        icon: "shadcn-:size-9",
        "icon-sm": "shadcn-:size-8",
        "icon-lg": "shadcn-:size-10",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
