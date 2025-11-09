import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "shadcn-:grid shadcn-:w-full shadcn-:auto-rows-[22rem] shadcn-:grid-cols-3 shadcn-:gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "shadcn-:group shadcn-:relative shadcn-:col-span-3 shadcn-:flex shadcn-:flex-col shadcn-:justify-between shadcn-:overflow-hidden shadcn-:rounded-xl",
      // light styles
      "shadcn-:bg-background shadcn-:[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "shadcn-:dark:bg-background shadcn-:transform-gpu shadcn-:dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] shadcn-:dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="shadcn-:p-4">
      <div className="shadcn-:pointer-events-none shadcn-:z-10 shadcn-:flex shadcn-:transform-gpu shadcn-:flex-col shadcn-:gap-1 shadcn-:transition-all shadcn-:duration-300 shadcn-:lg:group-hover:-translate-y-10">
        <Icon className="shadcn-:h-12 shadcn-:w-12 shadcn-:origin-left shadcn-:transform-gpu shadcn-:text-neutral-700 shadcn-:transition-all shadcn-:duration-300 shadcn-:ease-in-out shadcn-:group-hover:scale-75" />
        <h3 className="shadcn-:text-xl shadcn-:font-semibold shadcn-:text-neutral-700 shadcn-:dark:text-neutral-300">
          {name}
        </h3>
        <p className="shadcn-:max-w-lg shadcn-:text-neutral-400">{description}</p>
      </div>

      <div
        className={cn(
          "shadcn-:pointer-events-none shadcn-:flex shadcn-:w-full shadcn-:translate-y-0 shadcn-:transform-gpu shadcn-:flex-row shadcn-:items-center shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:translate-y-0 shadcn-:group-hover:opacity-100 shadcn-:lg:hidden"
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="shadcn-:pointer-events-auto shadcn-:p-0"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="shadcn-:ms-2 shadcn-:h-4 shadcn-:w-4 shadcn-:rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "shadcn-:pointer-events-none shadcn-:absolute shadcn-:bottom-0 shadcn-:hidden shadcn-:w-full shadcn-:translate-y-10 shadcn-:transform-gpu shadcn-:flex-row shadcn-:items-center shadcn-:p-4 shadcn-:opacity-0 shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:translate-y-0 shadcn-:group-hover:opacity-100 shadcn-:lg:flex"
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="shadcn-:pointer-events-auto shadcn-:p-0"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="shadcn-:ms-2 shadcn-:h-4 shadcn-:w-4 shadcn-:rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="shadcn-:pointer-events-none shadcn-:absolute shadcn-:inset-0 shadcn-:transform-gpu shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:bg-black/[.03] shadcn-:group-hover:dark:bg-neutral-800/10" />
  </div>
)

export { BentoCard, BentoGrid }
