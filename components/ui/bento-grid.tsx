import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "shadcn-:mx-auto shadcn-:grid shadcn-:max-w-7xl shadcn-:grid-cols-1 shadcn-:gap-4 shadcn-:md:auto-rows-[18rem] shadcn-:md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "shadcn-:group/bento shadcn-:shadow-input shadcn-:row-span-1 shadcn-:flex shadcn-:flex-col shadcn-:justify-between shadcn-:space-y-4 shadcn-:rounded-xl shadcn-:border shadcn-:border-neutral-200 shadcn-:bg-white shadcn-:p-4 shadcn-:transition shadcn-:duration-200 shadcn-:hover:shadow-xl shadcn-:dark:border-white/[0.2] shadcn-:dark:bg-black shadcn-:dark:shadow-none",
        className
      )}
    >
      {header}
      <div className="shadcn-:transition shadcn-:duration-200 shadcn-:group-hover/bento:translate-x-2">
        {icon}
        <div className="shadcn-:mt-2 shadcn-:mb-2 shadcn-:font-sans shadcn-:font-bold shadcn-:text-neutral-600 shadcn-:dark:text-neutral-200">
          {title}
        </div>
        <div className="shadcn-:font-sans shadcn-:text-xs shadcn-:font-normal shadcn-:text-neutral-600 shadcn-:dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background: React.ReactNode;
  Icon: React.ComponentType;
  description: string;
  href: string;
  cta: string;
}) => {
  return (
    <div
      className={cn(
        "shadcn-:group shadcn-:relative shadcn-:col-span-3 shadcn-:flex shadcn-:flex-col shadcn-:justify-between shadcn-:overflow-hidden shadcn-:rounded-xl",
        "shadcn-:border shadcn-:border-neutral-200 shadcn-:bg-white shadcn-:dark:border-white/[0.2] shadcn-:dark:bg-black",
        "shadcn-:transform-gpu",
        className
      )}
    >
      <div className="shadcn-:pointer-events-none shadcn-:absolute shadcn-:inset-0 shadcn-:transform-gpu shadcn-:overflow-hidden shadcn-:rounded-lg">
        {background}
      </div>
      <div className="shadcn-:pointer-events-none shadcn-:z-10 shadcn-:flex shadcn-:transform-gpu shadcn-:flex-col shadcn-:gap-1 shadcn-:p-6 shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:-translate-y-10">
        <Icon />
        <h3 className="shadcn-:text-xl shadcn-:font-semibold shadcn-:text-neutral-700 shadcn-:dark:text-neutral-300">
          {name}
        </h3>
        <p className="shadcn-:max-w-lg shadcn-:text-neutral-400">
          {description}
        </p>
      </div>

      <div className="shadcn-:pointer-events-none shadcn-:absolute shadcn-:bottom-0 shadcn-:flex shadcn-:w-full shadcn-:translate-y-10 shadcn-:transform-gpu shadcn-:flex-row shadcn-:items-center shadcn-:p-4 shadcn-:opacity-0 shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:translate-y-0 shadcn-:group-hover:opacity-100">
        <a
          href={href}
          className="shadcn-:pointer-events-auto shadcn-:text-sm shadcn-:font-medium shadcn-:text-neutral-700 shadcn-:dark:text-neutral-300"
        >
          {cta}
        </a>
      </div>
      <div className="shadcn-:pointer-events-none shadcn-:absolute shadcn-:inset-0 shadcn-:transform-gpu shadcn-:transition-all shadcn-:duration-300 shadcn-:group-hover:bg-black/[.03] shadcn-:group-hover:dark:bg-neutral-800/10" />
    </div>
  );
};
