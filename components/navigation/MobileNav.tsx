"use client";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import type { Transition } from "motion/react";
import ActiveLink from "./ActiveLink";
import { ChevronDown, Heart, X } from "lucide-react";
import { navigationLinks } from "@/config/navigation";

import "./MobileNav.css";

function MobileNav({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const scrollStylesRef = useRef<{ overflow: string; gutter: string } | null>(
    null,
  );
  const transition: Transition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.22, 1, 0.36, 1],
  };

  const restoreScroll = useCallback(() => {
    if (!scrollStylesRef.current) return;
    document.body.style.overflow = scrollStylesRef.current.overflow;
    document.documentElement.style.scrollbarGutter =
      scrollStylesRef.current.gutter;
    scrollStylesRef.current = null;
  }, []);

  // Keep the native dialog open and scrolling locked throughout the exit animation.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isMenuOpen || !dialog) return;
    if (!scrollStylesRef.current) {
      scrollStylesRef.current = {
        overflow: document.body.style.overflow,
        gutter: document.documentElement.style.scrollbarGutter,
      };
      document.documentElement.style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    }
    if (!dialog.open) dialog.showModal();

    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setIsMenuOpen(false);
    };
    closeOnDesktop();
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, [isMenuOpen, setIsMenuOpen]);

  // Also restore browser state if the header itself unmounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      dialog?.close();
      restoreScroll();
    };
  }, [restoreScroll]);

  const finishClosing = () => {
    if (isMenuOpen) return;
    dialogRef.current?.close();
    restoreScroll();
    setExpandedSection(null);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm transition-colors ${
      isActive
        ? "bg-primary/10 font-semibold text-primary"
        : "text-slate-600 hover:bg-white hover:text-primary"
    }`;

  return (
    <dialog
      ref={dialogRef}
      id="mobile-navigation"
      aria-labelledby="mobile-navigation-title"
      className="mobile-nav-dialog"
      onCancel={(event) => {
        event.preventDefault();
        closeMenu();
      }}
    >
      <AnimatePresence onExitComplete={finishClosing}>
        {isMenuOpen && (
          <Motion.div
            key="mobile-menu"
            className="mobile-nav-shell"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <Motion.button
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={transition}
              type="button"
              tabIndex={-1}
              aria-label="Close navigation backdrop"
              className="mobile-nav-backdrop"
              onClick={closeMenu}
            />

            <Motion.div
              className="mobile-nav-panel"
              variants={{
                closed: {
                  x: prefersReducedMotion ? 0 : "100%",
                  opacity: prefersReducedMotion ? 0 : 1,
                },
                open: { x: 0, opacity: 1 },
              }}
              transition={transition}
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 px-6 py-6">
                <ActiveLink
                  href="/"
                  onClick={closeMenu}
                  aria-label="Beloved Kindness Maxcare home"
                >
                  <Image
                    src={logo}
                    alt="Beloved Kindness Maxcare"
                    sizes="56px"
                    className="size-14 rounded-xl object-contain"
                  />
                </ActiveLink>
                <button
                  type="button"
                  autoFocus
                  onClick={closeMenu}
                  aria-label="Close navigation"
                  className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="min-h-0 flex-1 overflow-y-auto px-6 py-7"
              >
                <h2
                  id="mobile-navigation-title"
                  className="mb-5 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase"
                >
                  Explore Maxcare
                </h2>
                <ul className="space-y-1">
                  {navigationLinks.map((link) => {
                    const isExpanded = expandedSection === link.path;
                    const sectionId = `mobile-section-${link.path}`;

                    return (
                      <li
                        key={link.path}
                        className="border-b border-slate-200/70 last:border-0"
                      >
                        <div className="flex items-center gap-2 py-1">
                          <ActiveLink
                            href={`/${link.path}`}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                              `flex-1 rounded-lg py-4 text-lg font-semibold tracking-tight ${isActive ? "text-primary" : "hover:text-primary text-slate-800"}`
                            }
                          >
                            {link.label}
                          </ActiveLink>
                          {link.submenu && (
                            <button
                              type="button"
                              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${link.label}`}
                              aria-expanded={isExpanded}
                              aria-controls={sectionId}
                              onClick={() =>
                                setExpandedSection(
                                  isExpanded ? null : link.path,
                                )
                              }
                              className={`flex size-11 items-center justify-center rounded-full transition-colors ${isExpanded ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"}`}
                            >
                              <ChevronDown
                                aria-hidden="true"
                                className={`size-5 transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                        </div>
                        {link.submenu && (
                          <Motion.div
                            id={sectionId}
                            initial={false}
                            animate={{
                              height: isExpanded ? "auto" : 0,
                              opacity: isExpanded ? 1 : 0,
                            }}
                            transition={transition}
                            aria-hidden={!isExpanded}
                            inert={!isExpanded}
                            className="overflow-hidden"
                          >
                            <ul className="mb-3 space-y-1 rounded-2xl bg-slate-50 p-2">
                              {link.submenu.map((item) => (
                                <li key={item.path}>
                                  <ActiveLink
                                    href={`/${item.path}`}
                                    onClick={closeMenu}
                                    className={linkClass}
                                  >
                                    {item.label}
                                  </ActiveLink>
                                </li>
                              ))}
                            </ul>
                          </Motion.div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mobile-nav-footer border-t border-slate-200/70 bg-slate-50 px-6 pt-5">
                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                  A little kindness can make a lasting difference.
                </p>
                <ActiveLink
                  href="/get-involved/donate"
                  onClick={closeMenu}
                  className="bg-primary flex min-h-13 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <Heart className="size-5" aria-hidden="true" />
                  Donate
                </ActiveLink>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

export default MobileNav;
