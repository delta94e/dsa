"use client";

/**
 * ContextualBanner Component
 *
 * A banner with icon, heading, description, and actions.
 * Matches production bundle module 847673.
 */

import type { FC, ReactNode } from "react";

interface ContextualBannerProps {
  variant?: "contextualBannerPrimary" | "contextualBannerSecondary";
  heading: string;
  description: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const variantStyles = {
  contextualBannerPrimary: "bg-primary/10 border-primary/20",
  contextualBannerSecondary: "bg-surface-secondary border-border",
};

export const ContextualBanner: FC<ContextualBannerProps> = ({
  variant = "contextualBannerSecondary",
  heading,
  description,
  icon,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{heading}</h4>
        <p className="text-secondary-foreground text-sm">{description}</p>
      </div>

      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
};

export default ContextualBanner;
