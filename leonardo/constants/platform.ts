export const PLATFORM = {
  ANDROID: "Android",
  API: "API",
  IOS: "iOS",
  WEB: "Web",
} as const;

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];
