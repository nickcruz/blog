"use client";

import posthog from "posthog-js";
import {
  RiGithubLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiTwitterXLine,
} from "react-icons/ri";

type SocialIconName = "github" | "instagram" | "linkedin" | "twitter";

type TrackedSocialLinkProps = {
  href: string;
  label: string;
  icon: SocialIconName;
};

const iconMap = {
  github: RiGithubLine,
  instagram: RiInstagramLine,
  linkedin: RiLinkedinBoxLine,
  twitter: RiTwitterXLine,
} as const;

export function TrackedSocialLink({
  href,
  label,
  icon,
}: TrackedSocialLinkProps) {
  const Icon = iconMap[icon];

  function handleClick() {
    posthog.capture("social_link_clicked", {
      platform: label,
      url: href,
    });
  }

  return (
    <a
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center border border-border bg-background text-foreground transition-colors duration-150 hover:border-brand-accent hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      href={href}
      onClick={handleClick}
      rel="noreferrer noopener"
      target="_blank"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
