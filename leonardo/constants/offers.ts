/**
 * Subscription Offers & Retention
 */

export const OFFER_CODES = [
  "PayOneMonthGetOneMonthFree",
  "PayTwoMonthsGetTwoMonthsFree",
  "PayZeroMonthsGetThreeMonthsFree",
] as const;

export const SUB_STATUS = [
  "noSubscription",
  "previousSubscription",
  "subscription",
  "subscriptionIncomplete",
  "subscriptionWithPaymentPastDue",
  "subscriptionWithPendingCancellation",
] as const;

export const RETENTIONS_UPDATE = [
  "OfferAcceptance",
  "ShowingCountIncrement",
  "OfferActivation",
] as const;

export const RETENTIONS_GRACE_PERIOD_SECONDS = 604800;

export const OFFERS = {
  PayOneMonthGetOneMonthFree: {
    code: "PayOneMonthGetOneMonthFree",
    paidMonthsRequired: 1,
    freeMonthsProvided: 1,
    cycle: "MONTHLY",
    expirationDate: new Date("2024-05-28T23:59:00.000Z"),
  },
  PayTwoMonthsGetTwoMonthsFree: {
    code: "PayTwoMonthsGetTwoMonthsFree",
    paidMonthsRequired: 2,
    freeMonthsProvided: 2,
    cycle: "MONTHLY",
    expirationDate: new Date("2024-05-28T23:59:00.000Z"),
  },
  PayZeroMonthsGetThreeMonthsFree: {
    code: "PayZeroMonthsGetThreeMonthsFree",
    paidMonthsRequired: 0,
    freeMonthsProvided: 3,
    cycle: "MONTHLY",
    expirationDate: new Date("2024-08-21T23:59:00.000Z"),
    isDevOnly: true,
  },
} as const;
