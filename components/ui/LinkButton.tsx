import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary";
  border?: boolean;
  newTab?: boolean;
};

export default function LinkButton({
  href,
  children,
  icon: Icon,
  iconPosition = "left",
  variant = "primary",
  border = true,
  newTab = false,
}: LinkButtonProps) {
  if (variant === "secondary") {
    return (
      <Link
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={`hover:text-primary group flex w-fit items-center gap-1 rounded-md px-2 py-1 transition-all duration-300 md:py-2 ${
          border ? "border border-gray-300 hover:border-primary" : ""
        }`}
      >
        {children}

        {Icon && (
          <Icon
            className="group-hover:text-primary mt-1 text-gray-500 transition-all duration-200 group-hover:translate-x-0.5"
            size={18}
            aria-hidden="true"
          />
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="group relative flex cursor-pointer touch-manipulation border-0 bg-transparent p-0 outline-offset-4 transition-[filter] duration-250 select-none hover:brightness-110 focus:not-focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-0.5 rounded-xl bg-black/25 transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-1 group-hover:duration-250 group-hover:ease-[cubic-bezier(.3,.7,.4,1.5)] group-active:translate-y-px group-active:duration-[34ms]"
      />

      <span
        aria-hidden="true"
        className="bg-primary/60 absolute inset-0 rounded-xl"
      />

      <span className="bg-primary relative flex -translate-y-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white transition-transform duration-600 ease-[cubic-bezier(.3,.7,.4,1)] group-hover:-translate-y-1.5 group-hover:duration-250 group-hover:ease-[cubic-bezier(.3,.7,.4,1.5)] group-active:-translate-y-0.5 group-active:duration-[34ms]">
        {Icon && iconPosition === "left" && (
          <Icon className="mt-0.5 size-4" aria-hidden="true" />
        )}

        {children}

        {Icon && iconPosition === "right" && (
          <Icon className="mt-1 size-4.5" aria-hidden="true" />
        )}
      </span>
    </Link>
  );
}
