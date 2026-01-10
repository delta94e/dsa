"use client";

import { type FC, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalUrls } from "@/constants/externalUrls";
import { track, SidebarNavigationEvents } from "@/lib/analytics";
import { useFlags } from "@/hooks/useFlags";

// Icons
import {
  GlobeIcon,
  DiscordIcon,
  RedditIcon,
  XTwitterIcon,
  FacebookIcon,
  AppleIcon,
  PlaystoreIcon,
} from "@/components/icons/SocialIcons";

// Types
interface SocialLinkProps {
  href: string;
  label: string;
  children: ReactNode;
  onClick?: () => void;
}

/**
 * SocialLink
 *
 * Individual social media link item.
 */
const SocialLink: FC<SocialLinkProps> = ({
  href,
  label,
  children,
  onClick,
}) => (
  <li>
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "hover:text-secondary-foreground",
        "ring-offset-background focus-visible:ring-ring",
        "inline-flex rounded-3xl p-0.5",
        "transition duration-120",
        "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0"
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Link>
  </li>
);

/**
 * SocialLinksFooter
 *
 * Footer section with terms, policies, and social media links.
 */
export const SocialLinksFooter: FC = () => {
  const { affiliatesLinkValue = "https://affiliates.leonardo.ai/signup" } =
    useFlags();

  const handleLinkClick = (menuItem: string) => () => {
    track(SidebarNavigationEvents.ITEM_CLICKED, {
      menu_item: menuItem,
    });
  };

  return (
    <nav className="my-3 shrink-0" aria-label="External links navigation">
      {/* Text Links */}
      <ul className="text-tertiary-foreground flex list-none flex-row items-center justify-between gap-1.5 px-4.5 pb-3 font-normal">
        <li>
          <Link
            href={ExternalUrls.termsOfService}
            className={cn(
              "hover:text-secondary-foreground",
              "ring-offset-background focus-visible:ring-ring",
              "rounded-3xl text-xs",
              "transition duration-120",
              "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none"
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Terms of Service"
            title="Terms of Service"
            onClick={handleLinkClick("Terms of Service")}
          >
            Terms
          </Link>
        </li>

        <li
          className="bg-tertiary-foreground h-3 w-px"
          role="separator"
          aria-hidden="true"
        />

        <li>
          <Link
            href={ExternalUrls.dmcaPolicy}
            className={cn(
              "hover:text-secondary-foreground",
              "ring-offset-background focus-visible:ring-ring",
              "rounded-3xl text-xs",
              "transition duration-120",
              "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none"
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DMCA Policy"
            title="DMCA Policy"
            onClick={handleLinkClick("DMCA Policy")}
          >
            DMCA
          </Link>
        </li>

        <li
          className="bg-tertiary-foreground h-3 w-px"
          role="separator"
          aria-hidden="true"
        />

        <li>
          <Link
            href={affiliatesLinkValue}
            className={cn(
              "hover:text-secondary-foreground",
              "ring-offset-background focus-visible:ring-ring",
              "rounded-3xl text-xs",
              "transition duration-120",
              "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none"
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Affiliates Program"
            title="Affiliates Program"
            onClick={handleLinkClick("Affiliates Program")}
          >
            Affiliates
          </Link>
        </li>
      </ul>

      {/* Social Icons */}
      <ul
        className="text-tertiary-foreground flex list-none flex-row justify-between gap-1.5 px-5 pb-2"
        aria-label="Social media links"
      >
        <SocialLink
          href={ExternalUrls.website}
          label="Visit Leonardo.AI Website"
          onClick={handleLinkClick("Website Social Icon")}
        >
          <GlobeIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.discord}
          label="Join Leonardo.AI Discord Community"
          onClick={handleLinkClick("Discord Social Icon")}
        >
          <DiscordIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.reddit}
          label="Follow Leonardo.AI on Reddit"
          onClick={handleLinkClick("Reddit Social Icon")}
        >
          <RedditIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.x}
          label="Follow Leonardo.AI on X (Twitter)"
          onClick={handleLinkClick("X (Twitter) Social Icon")}
        >
          <XTwitterIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.facebook}
          label="Follow Leonardo.AI on Facebook"
          onClick={handleLinkClick("Facebook Social Icon")}
        >
          <FacebookIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.apple}
          label="Download Leonardo.AI on App Store"
          onClick={handleLinkClick("App Store Social Icon")}
        >
          <AppleIcon className="size-4.5" />
        </SocialLink>

        <SocialLink
          href={ExternalUrls.android}
          label="Download Leonardo.AI on Google Play Store"
          onClick={handleLinkClick("Google Play Store Social Icon")}
        >
          <PlaystoreIcon className="size-4.5" />
        </SocialLink>
      </ul>
    </nav>
  );
};

export default SocialLinksFooter;
