const getDaysInNextMonth = (dateStr: string | Date): number => {
  const date = new Date(dateStr);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 2);
  date.setUTCDate(0);
  return date.getUTCDate();
};

export const getNextMonthRenewalDateFromSubActivationDate = ({
  subActivationDate,
  currentRenewalDate,
}: {
  subActivationDate: string | Date;
  currentRenewalDate: string | Date;
}): Date => {
  const activationDate = new Date(subActivationDate);
  let activationDay = activationDate.getUTCDate();
  const daysInNextMonth = getDaysInNextMonth(currentRenewalDate);

  if (daysInNextMonth < activationDay) {
    activationDay = daysInNextMonth;
  }

  const nextRenewalContext = new Date(currentRenewalDate);
  const result = new Date(activationDate);

  // Set to 1st of next month relative to current renewal
  result.setUTCDate(1);
  result.setUTCFullYear(nextRenewalContext.getUTCFullYear());
  result.setUTCMonth(nextRenewalContext.getUTCMonth() + 1);
  result.setUTCDate(activationDay);

  return result;
};
