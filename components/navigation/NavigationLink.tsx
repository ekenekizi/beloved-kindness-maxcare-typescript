"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/config/navigation";
import { isActiveRoute, toHref } from "@/lib/navigation";
import ActiveLink from "./ActiveLink";
import SubMenu from "./SubMenu";

function NavigationLink({ path, label, icon, submenu }: NavigationItem) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const Icon = icon;
  const absolutePath = `/${path.replace(/^\/+/, "")}`;

  const isSubmenuActive = submenu?.some((item) =>
    isActiveRoute(pathname, toHref(item.path)),
  );

  return (
    <div
      className="relative flex cursor-pointer items-center gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsHovered(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsHovered(false);
      }}
    >
      <ActiveLink
        href={absolutePath}
        className={({ isActive }) =>
          `flex items-center gap-1 transition-colors ${
            isActive || isSubmenuActive ? "text-primary" : "text-slate-700"
          }`
        }
      >
        {label}
        {Icon && <Icon className="mt-1" />}
      </ActiveLink>

      {submenu && <SubMenu items={submenu} isHovered={isHovered} />}
    </div>
  );
}

export default NavigationLink;
