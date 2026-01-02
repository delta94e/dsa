"use client";

import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTE } from "@/constants/routes";

// ============================================================================
// Types
// ============================================================================

export interface TeamCongratsPopoverProps {
  /** Team name to display */
  teamName?: string | null;
  /** Callback when popover is closed */
  onClose: () => void;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Icons
// ============================================================================

const GradientCoinsIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 20 20" fill="none">
    <defs>
      <linearGradient
        id="coins-gradient"
        x1="2.49"
        y1="5.8"
        x2="15.59"
        y2="3.78"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M18.125 12.39c-.001-1.658-2.11-2.935-5-3.097V5.492c-.001-2.153-2.825-3.117-5.625-3.117s-5.624.963-5.625 3.117v9.183c0 2.153 2.825 3.117 5.625 3.117.289 0 .586-.027.881-.056a5.63 5.63 0 004.119.889c2.799 0 5.625-.964 5.625-3.117v-3.118zm-1.25.002c0 .882-1.871 1.867-4.375 1.867s-4.375-.986-4.375-1.867c0-.324.256-.66.698-.958l.041-.03c.77-.5 2.08-.88 3.636-.88 2.504 0 4.375.985 4.375 1.868zM11.875 8.442c0 .375-.33.69-.644.909-1.16.137-2.16.462-2.91.918-.268.023-.535.04-.82.04-2.357 0-4.376-1.027-4.376-1.867v-.877c1.084.71 2.732 1.045 4.375 1.045s3.291-.335 4.375-1.045v.877zM3.125 10.374c1.003.679 2.479 1.103 3.95 1.173-.128.268-.2.549-.2.846v1.006c-2.078-.159-3.75-1.075-3.75-1.84v-1.185zM7.5 3.625c2.151 0 4.375.698 4.375 1.867 0 1.214-2.254 1.868-4.375 1.868s-4.375-.654-4.375-1.868c0-1.169 2.224-1.867 4.375-1.867zm-4.375 11.05v-1.184c.958.647 2.345 1.063 3.75 1.16v.857c0 .38.092.72.252 1.026-2.028-.076-4.002-.758-4.002-1.859zm9.375 2.7c-1.349 0-2.726-.275-3.566-.768-.499-.294-.808-.664-.808-1.099v-1.112c1.015.689 2.57 1.114 4.375 1.114s3.36-.425 4.375-1.114v1.112c-.001 1.168-2.225 1.867-4.376 1.867z"
      fill="url(#coins-gradient)"
    />
  </svg>
);

const DrawIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <path
      d="M19.4 7.34L16.66 4.6a2 2 0 00-2.83 0l-9 9a2 2 0 00-.59 1.42v3.41a1 1 0 001 1h3.41a2 2 0 001.42-.59l9-9a2 2 0 000-2.83zM9.83 17.83H6.17v-3.66l6-6L15.83 12z"
      stroke="url(#leonardo-gradient-def)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CollectionIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="collection-gradient" x1="2" y1="4" x2="22" y2="20">
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM5 19V5h14v14H5z"
      fill="url(#collection-gradient)"
    />
    <path
      d="M9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"
      fill="url(#collection-gradient)"
    />
  </svg>
);

const SupportIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="support-gradient" x1="2" y1="4" x2="22" y2="20">
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
      fill="url(#support-gradient)"
    />
  </svg>
);

// ============================================================================
// Feature Item Component
// ============================================================================

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="flex gap-3 px-4">
    <div className="shrink-0">{icon}</div>
    <div className="flex flex-col">
      <span className="font-semibold text-white">{title}</span>
      <span className="text-sm leading-5 text-white/70">{description}</span>
    </div>
  </div>
);

// ============================================================================
// TeamCongratsPopover Component
// ============================================================================

/**
 * TeamCongratsPopover
 *
 * Displays congratulations message when user accepts a team invite.
 * Shows features available to the user as a team member.
 */
export const TeamCongratsPopover: FC<TeamCongratsPopoverProps> = ({
  teamName,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-lg bg-gradient-to-br from-[#020305] to-[#070A0F] p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-gradient text-2xl font-semibold">
          Congratulations!
        </span>
        <span className="text-gradient text-2xl font-semibold">
          You have joined {teamName || "a team"}
        </span>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-5">
        <FeatureItem
          icon={<DrawIcon />}
          title="Explore Creative Tools"
          description="Dive into our powerful tools and start generating high-quality content right away."
        />
        <FeatureItem
          icon={<CollectionIcon />}
          title="Create Team Collections"
          description="Organize your projects efficiently by setting up collections within the library."
        />
        <FeatureItem
          icon={<GradientCoinsIcon />}
          title="Utilise Shared Tokens"
          description="Access the shared pool of tokens to collaborate and create without limits."
        />
        <FeatureItem
          icon={<SupportIcon />}
          title="Get Support"
          description="Need help? Our support team is ready to assist you with any questions or issues."
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <Button variant="primary" size="sm" asChild onClick={onClose}>
          <Link href={ROUTE.HOME}>Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default TeamCongratsPopover;
