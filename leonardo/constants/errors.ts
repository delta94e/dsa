export enum ErrorCode {
  // Moderation Errors
  M001 = "M001",
  M003 = "M003",
  M004 = "M004",
  M005 = "M005",

  // Team Payment Errors
  TP001 = "TP001",
  TP002 = "TP002",

  // Limit/Stream Errors
  LS001 = "LS001",
  LS002 = "LS002",
  LS003 = "LS003",

  // Warning
  W001 = "W001",

  // Image Moderation
  IM001 = "IM001",
  IM002 = "IM002",
  IM003 = "IM003",
  IM004 = "IM004",
}

export interface ErrorDetail {
  code: string;
  description: string;
}

export const ErrorDetails: Record<ErrorCode, ErrorDetail> = {
  [ErrorCode.M001]: {
    code: "m001",
    description: "A paid user has a prompt moderated",
  },
  [ErrorCode.M003]: {
    code: "m003",
    description: "A user has been temporarily suspended",
  },
  [ErrorCode.M004]: {
    code: "m004",
    description: "A user has been permanently suspended",
  },
  [ErrorCode.M005]: {
    code: "m005",
    description: "A user has had a prompt blocked",
  },
  [ErrorCode.TP001]: {
    code: "tp001",
    description:
      "A team subscription payment is past due or canceled due to payment failure.",
  },
  [ErrorCode.TP002]: {
    code: "tp002",
    description: "A team subscription payment has been manually cancelled.",
  },
  [ErrorCode.LS001]: {
    code: "ls001",
    description:
      "A user has reached their daily usage limit, signals an immediate halt to the stream.",
  },
  [ErrorCode.LS002]: {
    code: "ls002",
    description:
      "A user has reached their monthly usage limit, signals an immediate halt to the stream.",
  },
  [ErrorCode.LS003]: {
    code: "ls003",
    description:
      "A user has reached their usage limit, signals an immediate halt to the stream.",
  },
  [ErrorCode.W001]: {
    code: "w001",
    description:
      "A persistent warning that requires user action to dismiss it.",
  },
  [ErrorCode.IM001]: {
    code: "m001",
    description:
      "A user has had an image blocked. User has been permanently suspended.",
  },
  [ErrorCode.IM002]: {
    code: "m002",
    description:
      "A user has had an image blocked. User has been temporarily suspended.",
  },
  [ErrorCode.IM003]: {
    code: "m003",
    description: "A user has had an image blocked.",
  },
  [ErrorCode.IM004]: {
    code: "m004",
    description: "Image moderation failed.",
  },
};
