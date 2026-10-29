import { Reveal } from "@/components/animation/HomepageMotion";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import Logo from "@/components/layout/Logo";

type SocialLink = {
  label: string;
  text: string;
  href: string;
};

// Add your official social media profiles here later.
const socialLinks: SocialLink[] = [];

const footerGroups = [
  {
    title: "Our Organisation",
    links: [
      { label: "Home", href: "/" },
      { label: "Our Story", href: "/about/story" },
      { label: "Mission & Objectives", href: "/about/mission" },
      { label: "Our Team", href: "/about/team" },
      { label: "Our Impact", href: "/impact" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Our Programmes",
    links: [
      { label: "Education & Child Counselling", href: "/programs/education" },
      { label: "Orphanage Outreach", href: "/programs/orphanage" },
      { label: "Widow Empowerment", href: "/programs/widow" },
      { label: "Christmas Celebration", href: "/programs/party" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Donate", href: "/get-involved/donate" },
      { label: "Become a Volunteer", href: "/get-involved/volunteer" },
      { label: "Partner With Us", href: "/get-involved/partner" },
    ],
  },
];

const linkStyles =
  "rounded-sm transition-colors duration-200 hover:text-white " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 " +
  "focus-visible:outline-[#F5B700]";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B203D] font-sans text-[#B2BFD0]">
      <div className="mx-auto max-w-[1280px] px-5 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          {/* Organisation and contact information */}
          <Reveal as="div" className="max-w-md">
            <Logo />

            <p className="mt-6 text-sm leading-7 sm:text-base">
              Restoring hope and dignity through compassion, education and
              practical support for children, widows and communities across
              Nigeria.
            </p>

            <address className="mt-7 space-y-4 text-sm leading-6 not-italic">
              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#F5B700]"
                />

                <span>Nigeria</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#F5B700]"
                />

                <a href="tel:+2349030836084" className={linkStyles}>
                  +234 903 083 6084
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#F5B700]"
                />

                <a
                  href="mailto:info@belovedkindnessmaxcare.com"
                  className={`break-all ${linkStyles}`}
                >
                  info@belovedkindnessmaxcare.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#F5B700]"
                />

                <a
                  href="https://wa.me/2347088881246"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                >
                  Chat with us on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </address>

            {/* Appears automatically when social links are added */}
            {socialLinks.length > 0 && (
              <nav aria-label="Social media" className="mt-8">
                <ul className="flex flex-wrap gap-3">
                  {socialLinks.map(({ label, text, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${label} (opens in a new tab)`}
                        className="flex size-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5B700]"
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </Reveal>

          {/* Existing public routes */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:contents">
            {footerGroups.map(({ title, links }) => (
              <Reveal as="nav"
                key={title}
                aria-label={`${title} footer links`}
                className="min-w-0"
              >
                <h2 className="mb-5 text-base font-bold text-white">{title}</h2>

                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`inline-block text-sm leading-6 ${linkStyles}`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 py-6 sm:mt-16 lg:py-8">
          <p className="text-xs leading-6 sm:text-sm">
            © {year} Beloved Kindness Maxcare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
