"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "shadcn-:bg-background shadcn-:group/calendar shadcn-:p-3 shadcn-:[--cell-size:2rem] shadcn-:[[data-slot=card-content]_&]:bg-transparent shadcn-:[[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("shadcn-:w-fit", defaultClassNames.root),
        months: cn(
          "shadcn-:relative shadcn-:flex shadcn-:flex-col shadcn-:gap-4 shadcn-:md:flex-row",
          defaultClassNames.months
        ),
        month: cn("shadcn-:flex shadcn-:w-full shadcn-:flex-col shadcn-:gap-4", defaultClassNames.month),
        nav: cn(
          "shadcn-:absolute shadcn-:inset-x-0 shadcn-:top-0 shadcn-:flex shadcn-:w-full shadcn-:items-center shadcn-:justify-between shadcn-:gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "shadcn-:h-[--cell-size] shadcn-:w-[--cell-size] shadcn-:select-none shadcn-:p-0 shadcn-:aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "shadcn-:h-[--cell-size] shadcn-:w-[--cell-size] shadcn-:select-none shadcn-:p-0 shadcn-:aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "shadcn-:flex shadcn-:h-[--cell-size] shadcn-:w-full shadcn-:items-center shadcn-:justify-center shadcn-:px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "shadcn-:flex shadcn-:h-[--cell-size] shadcn-:w-full shadcn-:items-center shadcn-:justify-center shadcn-:gap-1.5 shadcn-:text-sm shadcn-:font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "shadcn-:has-focus:border-ring shadcn-:border-input shadcn-:shadow-xs shadcn-:has-focus:ring-ring/50 shadcn-:has-focus:ring-[3px] shadcn-:relative shadcn-:rounded-md shadcn-:border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "shadcn-:bg-popover shadcn-:absolute shadcn-:inset-0 shadcn-:opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "shadcn-:select-none shadcn-:font-medium",
          captionLayout === "label"
            ? "shadcn-:text-sm"
            : "shadcn-:[&>svg]:text-muted-foreground shadcn-:flex shadcn-:h-8 shadcn-:items-center shadcn-:gap-1 shadcn-:rounded-md shadcn-:pl-2 shadcn-:pr-1 shadcn-:text-sm shadcn-:[&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "shadcn-:w-full shadcn-:border-collapse",
        weekdays: cn("shadcn-:flex", defaultClassNames.weekdays),
        weekday: cn(
          "shadcn-:text-muted-foreground shadcn-:flex-1 shadcn-:select-none shadcn-:rounded-md shadcn-:text-[0.8rem] shadcn-:font-normal",
          defaultClassNames.weekday
        ),
        week: cn("shadcn-:mt-2 shadcn-:flex shadcn-:w-full", defaultClassNames.week),
        week_number_header: cn(
          "shadcn-:w-[--cell-size] shadcn-:select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "shadcn-:text-muted-foreground shadcn-:select-none shadcn-:text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "shadcn-:group/day shadcn-:relative shadcn-:aspect-square shadcn-:h-full shadcn-:w-full shadcn-:select-none shadcn-:p-0 shadcn-:text-center shadcn-:[&:first-child[data-selected=true]_button]:rounded-l-md shadcn-:[&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "shadcn-:bg-accent shadcn-:rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("shadcn-:rounded-none", defaultClassNames.range_middle),
        range_end: cn("shadcn-:bg-accent shadcn-:rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "shadcn-:bg-accent shadcn-:text-accent-foreground shadcn-:rounded-md shadcn-:data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "shadcn-:text-muted-foreground shadcn-:aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "shadcn-:text-muted-foreground shadcn-:opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("shadcn-:invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("shadcn-:size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("shadcn-:size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("shadcn-:size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="shadcn-:flex shadcn-:size-[--cell-size] shadcn-:items-center shadcn-:justify-center shadcn-:text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "shadcn-:data-[selected-single=true]:bg-primary shadcn-:data-[selected-single=true]:text-primary-foreground shadcn-:data-[range-middle=true]:bg-accent shadcn-:data-[range-middle=true]:text-accent-foreground shadcn-:data-[range-start=true]:bg-primary shadcn-:data-[range-start=true]:text-primary-foreground shadcn-:data-[range-end=true]:bg-primary shadcn-:data-[range-end=true]:text-primary-foreground shadcn-:group-data-[focused=true]/day:border-ring shadcn-:group-data-[focused=true]/day:ring-ring/50 shadcn-:flex shadcn-:aspect-square shadcn-:h-auto shadcn-:w-full shadcn-:min-w-[--cell-size] shadcn-:flex-col shadcn-:gap-1 shadcn-:font-normal shadcn-:leading-none shadcn-:data-[range-end=true]:rounded-md shadcn-:data-[range-middle=true]:rounded-none shadcn-:data-[range-start=true]:rounded-md shadcn-:group-data-[focused=true]/day:relative shadcn-:group-data-[focused=true]/day:z-10 shadcn-:group-data-[focused=true]/day:ring-[3px] shadcn-:[&>span]:text-xs shadcn-:[&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
