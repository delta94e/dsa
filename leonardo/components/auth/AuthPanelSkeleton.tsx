"use client";

import { type FC } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

// ============================================================================
// Types
// ============================================================================

type AuthPanelVariant = "full" | "compact";

interface AuthPanelSkeletonProps {
  variant?: AuthPanelVariant;
  height?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * AuthPanelSkeleton (nz in production)
 *
 * Loading skeleton for the AuthPanel component.
 * Displays placeholder UI while auth state is being determined.
 *
 * Shows appropriate skeleton based on session status:
 * - Unauthenticated: Two button placeholders
 * - Authenticated: Avatar + text + token bar placeholders
 */
export const AuthPanelSkeleton: FC<AuthPanelSkeletonProps> = ({
  variant = "full",
  height,
}) => {
  const { status } = useSession();
  const isUnauthenticated = status !== "authenticated";
  const isCompact = variant === "compact";

  return (
    <div
      className={cn("relative w-full", { "mx-4.5 mt-2.5": !isCompact })}
      style={{ height }}
    >
      {/* Unauthenticated skeleton - two button placeholders */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center transition-opacity duration-600",
          isUnauthenticated ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex flex-col justify-around gap-2">
          <Skeleton
            className={cn("h-8 w-full", { "rounded-full": isCompact })}
          />
          <Skeleton
            className={cn("h-8 w-full", { "rounded-full": isCompact })}
          />
        </div>
      </div>

      {/* Authenticated skeleton - avatar + text + token bar */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center gap-3.5 transition-opacity duration-600",
          isUnauthenticated ? "pointer-events-none opacity-0" : "opacity-100",
          { "flex-col-reverse": isCompact }
        )}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-grow" />
          {!isCompact && <Skeleton className="h-6 w-6" />}
        </div>

        {/* Token bar */}
        <div>
          <Skeleton className="h-6.5 w-full" />
        </div>
      </div>
    </div>
  );
};

export default AuthPanelSkeleton;
