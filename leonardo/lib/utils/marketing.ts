import { STRIPE_REDIRECT_TO_PORTAL_URL } from "@/lib/config";
import { SUBSCRIPTION_SOURCE } from "@/lib/constants/enums";

export const getRewardfulCoupon = () =>
  (window as any)?.Rewardful?.coupon?.id || undefined;
export const getRewardfulReferral = () =>
  (window as any)?.Rewardful?.referral || undefined;

export const redirectToStripePortal = () => {
  window.location.href = STRIPE_REDIRECT_TO_PORTAL_URL;
};

export const isSubscribedViaApple = (source: string) =>
  source === SUBSCRIPTION_SOURCE.APPLE;
export const isSubscribedViaGoogle = (source: string) =>
  source === SUBSCRIPTION_SOURCE.GOOGLE;
