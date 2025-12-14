import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone"; // <-- add this
import isTodayPlugin from "dayjs/plugin/isToday";
import isYesterdayPlugin from "dayjs/plugin/isYesterday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { UK_TIMEZONE } from "@/setting";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);          // must extend before timezone
dayjs.extend(timezone);     // <-- extend timezone
dayjs.extend(relativeTime);
dayjs.extend(isTodayPlugin);
dayjs.extend(isYesterdayPlugin);
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);

/**
 * Format relative time (e.g. "1 minute ago", "3 hours ago")
 */
export const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) return "";

  const date = dayjs(timestamp);
  if (!date.isValid()) return "";

  return date.fromNow();
};

/**
 * Human readable date for notifications:
 * - Today, 3:45PM
 * - Yesterday, 11:18AM
 * - Tue 5:21PM (same week)
 * - 3rd, January (older)
 */ 

export function formatHumanReadableDate(timestamp: string): string {
  const date = dayjs.utc(timestamp).tz(UK_TIMEZONE); // convert to UK time
  if (!date.isValid()) return "";

  const now = dayjs().tz(UK_TIMEZONE);
  const tomorrow = now.add(1, "day");

  if (date.isToday()) {
    return `Today, ${date.format("h:mma")}`;
  }

  if (
    date.date() === tomorrow.date() &&
    date.month() === tomorrow.month() &&
    date.year() === tomorrow.year()
  ) {
    return `Tomorrow, ${date.format("h:mma")}`;
  }

  if (date.isYesterday()) {
    return `Yesterday, ${date.format("h:mma")}`;
  }

  if (date.week() === now.week()) {
    return `${date.format("ddd")} ${date.format("h:mma")}`;
  }

  return date.format("Do MMMM, YYYY");
}


/**
 * Simple short formatting (e.g. "21 Feb")
 */
export function formatDate(date: string | Date): string {
  const d = dayjs(date);
  if (!d.isValid()) return "";

  return d.format("DD MMM");
}
