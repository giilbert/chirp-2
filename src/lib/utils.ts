import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const betterFormatDate = (date: Date) => {
  const dateMoment = moment(date);
  const now = moment();
  const diffHours = now.diff(dateMoment, "hours");
  const diffDays = now.diff(dateMoment, "days");

  // if the time is less than 6 hours ago, return a relative time
  if (diffHours < 6) return dateMoment.fromNow();

  // if it was more than a month ago, return a date
  if (diffDays > 30) {
    // if not in the same year, return a year
    if (now.year() !== dateMoment.year())
      return dateMoment.format("MMM D, YYYY");
    // otherwise return a month and day
    return dateMoment.format("MMM D");
  }

  // if the date is not the same, return a month and a day
  if (now.date() !== dateMoment.date()) return dateMoment.format("MMM D");

  // otherwise only return a time
  return dateMoment.format("H:MM A");
};
