import type { SVGProps } from "react";
import { socialUrl, type SocialLinks as SocialLinksData } from "@/features/site/social-links";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Facebook({ size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 22v-9h3l.5-4h-3.5V6.5c0-1.2.4-2 2-2H17V1.1A20 20 0 0 0 14.4 1C11.7 1 10 2.7 10 5.8V9H7v4h3v9z" />
  </svg>;
}

function Instagram({ size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <rect x={3} y={3} width={18} height={18} rx={5} />
    <circle cx={12} cy={12} r={4} />
    <circle cx={17.5} cy={6.5} r={1} fill="currentColor" stroke="none" />
  </svg>;
}

function Linkedin({ size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.53 2.79-1.53 2.99 0 3.58 1.97 3.58 4.53v5.25Z" />
  </svg>;
}

function XIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z" />
    </svg>
  );
}

export default function SocialLinks({
  links,
  className = "",
}: {
  links: SocialLinksData;
  className?: string;
}) {
  const profiles = [
    { name: "Facebook", href: socialUrl(links.facebookUrl), Icon: Facebook },
    { name: "Instagram", href: socialUrl(links.instagramUrl), Icon: Instagram },
    { name: "LinkedIn", href: socialUrl(links.linkedinUrl), Icon: Linkedin },
    { name: "X", href: socialUrl(links.xUrl), Icon: XIcon },
  ].filter((profile) => profile.href);

  if (!profiles.length) return null;

  return (
    <div role="group" aria-label="Follow BKM on social media" className={"flex items-center gap-1 " + className}>
      {profiles.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"BKM on " + name + " (opens in a new tab)"}
          title={name}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon size={20} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
