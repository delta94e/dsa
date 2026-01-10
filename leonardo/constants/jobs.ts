export const JOB_STATUS = {
  PENDING: "PENDING",
  COMPLETE: "COMPLETE",
  FAILED: "FAILED",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
