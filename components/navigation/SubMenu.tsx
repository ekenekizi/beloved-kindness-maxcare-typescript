"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import type { NavigationItem } from "@/config/navigation";
import ActiveLink from "./ActiveLink";

const submenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

function SubMenu({ items, isHovered }: { items: NonNullable<NavigationItem["submenu"]>; isHovered: boolean }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          variants={submenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full left-0 w-52 pt-3"
        >
          <ul className="rounded-md bg-white p-2 shadow-lg">
            {items.map((item) => (
              <li key={item.path}>
                <ActiveLink
                  href={`/${item.path.replace(/^\/+/, "")}`}
                  className={({ isActive }) =>
                    `block rounded-md px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SubMenu;
