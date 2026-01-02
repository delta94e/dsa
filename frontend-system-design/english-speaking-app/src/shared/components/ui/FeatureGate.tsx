'use client';

// ═══════════════════════════════════════════════════════════════
// Feature Gate Component
// Wraps protected content with real-time feature flag checking
// Redirects user when feature is disabled in real-time
// ═══════════════════════════════════════════════════════════════

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFeatureFlagStore } from '@/stores/featureFlagStore';
import { FeatureDisabledPage } from './FeatureDisabledPage';
import { notifications } from '@mantine/notifications';

interface FeatureGateProps {
  /** The feature flag ID to check */
  featureId: string;
  /** The display name of the feature for UI */
  featureName: string;
  /** Children to render if feature is enabled */
  children: ReactNode;
  /** Custom redirect path when disabled (default: /) */
  redirectTo?: string;
  /** Show notification when redirecting (default: true) */
  showNotification?: boolean;
  /** Custom fallback component */
  fallback?: ReactNode;
}

export function FeatureGate({
  featureId,
  featureName,
  children,
  redirectTo = '/',
  showNotification = true,
  fallback,
}: FeatureGateProps) {
  const router = useRouter();
  const { isFeatureEnabled, userFlags } = useFeatureFlagStore();
  const [wasEnabled, setWasEnabled] = useState<boolean | null>(null);
  const isEnabled = isFeatureEnabled(featureId);
  const hasRedirectedRef = useRef(false);

  // Track if feature was enabled and is now disabled (real-time change)
  useEffect(() => {
    // First time: just record the initial state
    if (wasEnabled === null) {
      setWasEnabled(isEnabled);
      return;
    }

    // Feature was enabled and now disabled → redirect with notification
    if (wasEnabled === true && isEnabled === false && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;

      console.log(`[FeatureGate] Feature "${featureId}" was disabled in real-time. Redirecting...`);

      if (showNotification) {
        notifications.show({
          title: 'Feature Disabled',
          message: `The "${featureName}" feature has been disabled by an administrator. You have been redirected.`,
          color: 'orange',
          autoClose: 5000,
          icon: '🚫',
        });
      }

      router.push(redirectTo);
    }

    // Update tracked state
    setWasEnabled(isEnabled);
  }, [isEnabled, wasEnabled, featureId, featureName, redirectTo, router, showNotification]);

  // If not enabled, show fallback or disabled page
  if (!isEnabled) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <FeatureDisabledPage
        featureName={featureName}
        redirectHref={redirectTo}
      />
    );
  }

  // Feature is enabled, render children
  return <>{children}</>;
}

/**
 * Hook version for programmatic feature checking
 * Returns current enable state and whether it was just disabled
 */
export function useFeatureGate(featureId: string) {
  const { isFeatureEnabled } = useFeatureFlagStore();
  const [wasEnabled, setWasEnabled] = useState<boolean | null>(null);
  const isEnabled = isFeatureEnabled(featureId);

  const wasJustDisabled = wasEnabled === true && isEnabled === false;

  useEffect(() => {
    setWasEnabled(isEnabled);
  }, [isEnabled]);

  return {
    isEnabled,
    wasJustDisabled,
    wasEnabled,
  };
}
