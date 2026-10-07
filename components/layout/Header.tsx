"use client";

import { navigationLinks } from "@/config/navigation";
import LinkButton from "@/components/ui/LinkButton";
import NavigationLink from "../navigation/NavigationLink";
import { Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import MobileNav from "../navigation/MobileNav";
import Logo from "./Logo";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleScroll(); // Set the correct state if the page loads partway down
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 z-20 flex w-full items-center justify-between gap-4 border-b px-4 transition-all duration-300 sm:px-6 lg:px-10 xl:px-20 ${
        isScrolled
          ? "bg-background/80 top-0 border-white/20 py-3 shadow-lg shadow-black/10 backdrop-blur-md"
          : "top-5 border-transparent bg-transparent py-0 shadow-none"
      }`}
    >
      <Logo />

      <nav className="hidden items-center gap-5 lg:flex">
        {navigationLinks.map((link) => (
          <NavigationLink
            path={link.path}
            label={link.label}
            icon={link.icon}
            submenu={link.submenu}
            key={link.label}
          />
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <LinkButton href="/get-involved/donate" icon={Heart}>Donate</LinkButton>

        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="focus-visible:outline-primary rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-4 lg:hidden"
        >
          {isMenuOpen ? (
            <X className="size-7" aria-hidden="true" />
          ) : (
            <Menu className="size-7" aria-hidden="true" />
          )}
        </button>
      </div>

      <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </header>
  );
}

export default Header;
