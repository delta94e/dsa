import dayjs from "dayjs";
import { formatPlural } from "./string";
import { toOrdinal } from "./number";

interface FormatTimeDistanceOptions {
  endedText?: string;
  longFormat?: boolean;
  includeSeconds?: boolean;
}

export const formatDateVerbose = (date: string | Date): string => {
  const d = dayjs(date);
  const dayWithOrdinal = toOrdinal(d.date());
  const month = d.format("MMMM");
  return `${dayWithOrdinal} ${month}`;
};

export const formatDateTimeStr = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YY [at] h:mm A");
};

export const formatDateTimeStrAlternate = (date: string | Date): string => {
  return dayjs(date).format("DD MMM YYYY hh:mma");
};

export const getNextUTCMidnight = (): number => {
  const now = new Date();
  const h = now.getUTCHours();
  const m = now.getUTCMinutes();
  const s = now.getUTCSeconds();
  // 86400000 ms in a day
  const msPassed = (h * 3600 + m * 60 + s) * 1000;
  return now.getTime() + (86400000 - msPassed);
};

export const getNextUTCMonthTimestamp = (): number => {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(1);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date.getTime();
};

export const formatSecondsToHuman = (seconds: number): string => {
  if (seconds === 1) return "one second";
  if (seconds < 60) return `${seconds} seconds`;

  if (seconds < 3600) {
    const min = Math.floor(seconds / 60);
    return min === 1 ? "1 minute" : `${min} minutes`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? "an hour" : `${hours} hours`;
  }

  const days = Math.floor(seconds / 86400);
  return days === 1 ? "a day" : `${days} days`;
};

export const formatUnixSecondsToLongHuman = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  const day = date.getDate();
  const ordinal = toOrdinal(day).replace(day.toString(), ""); // Extract just st, nd, rd, th

  const formatted = new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }).format(date);

  // Inject ordinal and fix AM/PM case
  return formatted
    .replace(`, ${day} `, ` ${day}${ordinal} of `)
    .replace(/\s(am|pm)/, (match, p1) => p1.toUpperCase());
};

export const formatTimeDistanceToHuman = (
  ms: number,
  options: FormatTimeDistanceOptions = { endedText: "expired" }
): string => {
  if (ms <= 0) return options.endedText || "";

  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (!options.longFormat) {
    return (
      formatPlural("day", days) ||
      formatPlural("hr", hours) ||
      formatPlural("min", minutes) ||
      formatPlural("sec", seconds) ||
      "now"
    );
  }

  const parts: string[] = [];
  if (days) parts.push(formatPlural("day", days)!);
  if (hours) parts.push(formatPlural("hour", hours)!);
  if (minutes) parts.push(formatPlural("minute", minutes)!);

  const shouldShowSeconds =
    options.includeSeconds || (days === 0 && hours === 0 && minutes === 0);
  if (seconds && shouldShowSeconds) {
    parts.push(formatPlural("second", seconds)!);
  }

  if (parts.length === 0) return "now";
  if (parts.length === 1) return parts[0];

  return `${parts.slice(0, -1).join(", ")} and ${parts.slice(-1)[0]}`;
};

export const formatDistanceFromNowToDate = (date: Date): string => {
  return formatTimeDistanceToHuman(date.getTime() - Date.now());
};
