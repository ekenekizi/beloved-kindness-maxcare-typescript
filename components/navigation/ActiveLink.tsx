"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { isActiveRoute, toHref } from "@/lib/navigation";

type ActiveLinkProps = Omit<ComponentProps<typeof Link>, "href" | "className"> & {
  href: string;
  className?: string | ((state: { isActive: boolean }) => string);
};

export default function ActiveLink({ href, className, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  const absoluteHref = toHref(href);
  const isActive = isActiveRoute(pathname, absoluteHref);

  return (
    <Link
      {...props}
      href={absoluteHref}
      aria-current={pathname === absoluteHref ? "page" : undefined}
      className={typeof className === "function" ? className({ isActive }) : className}
    />
  );
}