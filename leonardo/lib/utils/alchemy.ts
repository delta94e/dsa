const ALCHEMY_ACCESS_DEFAULT = [
  {
    startDate: "2024-01-22T00:00:00.000Z",
    endDate: "2024-01-28T23:59:59.999Z",
  },
];

const isValidDateString = (dateStr: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateStr)) return false;
  const date = new Date(dateStr);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toISOString() === dateStr
  );
};

export const getAlchemyAccessDetails = (
  accessWindows = ALCHEMY_ACCESS_DEFAULT
): { unrestricted: boolean; startDate?: string; endDate?: string } => {
  const now = new Date();
  for (const window of accessWindows) {
    const { startDate, endDate } = window;
    if (isValidDateString(startDate) && isValidDateString(endDate)) {
      if (now >= new Date(startDate) && now <= new Date(endDate)) {
        return { unrestricted: true, startDate, endDate };
      }
    } else {
      throw new Error(
        `invalid date range(s) provided, must be in extended ISO8601 format with millisecond precision in Z timezone ${JSON.stringify(
          accessWindows,
          undefined,
          2
        )}`
      );
    }
  }
  return { unrestricted: false };
};
