import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import Logo from "@/components/layout/Logo";

type SocialLink = {
  label: string;
  text: string;
  href: string;
};

type FooterProps = {
  socialLinks?: SocialLink[];
};

const footerGroups = [
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about/story" },
      { label: "Our Team", href: "/about/team" },
      { label: "Annual Report", href: "/annual-report" },
      { label: "Media & Press", href: "/media" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Orphan Support", href: "/programs/orphanage" },
      { label: "Widow Empowerment", href: "/programs/widow" },
      { label: "Scholarship Fund", href: "/programs/scholarships" },
      { label: "Medical Outreach", href: "/programs/medical-outreach" },
      {
        label: "Vocational Training",
        href: "/programs/vocational-training",
      },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Donate Now", href: "/get-involved/donate" },
      { label: "Volunteer", href: "/get-involved/volunteer" },
      { label: "Partner With Us", href: "/get-involved/partner" },
      { label: "Sponsor a Child", href: "/sponsor-a-child" },
      { label: "Fundraise", href: "/fundraise" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog & News", href: "/blog" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const linkStyles =
  "rounded-sm transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5B700]";

export default function Footer({ socialLinks = [] }: FooterProps = {}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B203D] font-sans text-[#9AAAC0]">
      <div className="mx-auto max-w-[1536px] px-6 pt-14 sm:px-8 lg:px-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr)_repeat(4,minmax(0,0.75fr))] lg:gap-x-10 xl:gap-x-14">
          <div className="max-w-md">
            <Logo />

            <p className="mt-6 text-base leading-7">
              Restoring hope and transforming lives through compassion,
              education, empowerment, and sustainable community action across
              Nigeria since 2012.
            </p>

            <address className="mt-7 space-y-3 text-base leading-6 not-italic">
              <div className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#F5B700]"
                />

                <span>
                  123 Kindness Avenue, Victoria Island, Lagos, Nigeria
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#F5B700]"
                />

                <span>+234 800 BKM CARE</span>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#F5B700]"
                />

                <a
                  href="mailto:info@bkmaxcare.org"
                  className={`break-all ${linkStyles}`}
                >
                  info@bkmaxcare.org
                </a>
              </div>
            </address>

            {socialLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map(({ label, text, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-[#C1CCDC] transition-colors duration-200 hover:bg-[#1F5FFF] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5B700]"
                  >
                    {text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:contents">
            {footerGroups.map((group) => (
              <nav
                key={group.title}
                aria-label={`${group.title} footer links`}
                className="min-w-0"
              >
                <h2 className="mb-5 text-base font-bold text-white lg:mb-6 lg:text-lg">
                  {group.title}
                </h2>

                <ul className="space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`inline-block text-sm leading-6 sm:text-base ${linkStyles}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 py-6 text-sm leading-6 sm:mt-16 md:flex-row md:items-center md:justify-between lg:mt-20 lg:py-8">
          <p className="max-w-xl">
            © {year} Beloved Kindness Maxcare. All rights reserved. Registered
            NGO in Nigeria.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkStyles}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
