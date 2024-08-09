// utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FUNCTION TO ADJUST TIMEZONE
const adjustTimezone = (date: Date, offset: number) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
};

// FORMAT DATE TIME
export const formatDateTime = (
  dateString: Date | string,
  timezone: "WIB" | "WITA" | "WIT" = "WIB"
) => {
  const date = new Date(dateString);

  let adjustedDate;
  switch (timezone) {
    case "WITA":
      adjustedDate = adjustTimezone(date, 8);
      break;
    case "WIT":
      adjustedDate = adjustTimezone(date, 9);
      break;
    case "WIB":
    default:
      adjustedDate = adjustTimezone(date, 7);
      break;
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: false, // use 24-hour clock
    timeZone: "Asia/Jakarta", // setting timezone to UTC as the offset is already adjusted
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
    timeZone: "Asia/Jakarta", // setting timezone to UTC as the offset is already adjusted
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: "Asia/Jakarta", // setting timezone to UTC as the offset is already adjusted
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: false, // use 24-hour clock
    timeZone: "Asia/Jakarta", // setting timezone to UTC as the offset is already adjusted
  };

  const formattedDateTime: string = adjustedDate.toLocaleString(
    "id-ID",
    dateTimeOptions
  );
  const formattedDateDay: string = adjustedDate.toLocaleString(
    "id-ID",
    dateDayOptions
  );
  const formattedDate: string = adjustedDate.toLocaleString(
    "id-ID",
    dateOptions
  );
  const formattedTime: string = adjustedDate.toLocaleString(
    "id-ID",
    timeOptions
  );

  return {
    dateTime: ` ${formattedDateTime} ${timezone}`,
    dateDay: `${formattedDateDay} ${timezone}`,
    dateOnly: `${formattedDate} ${timezone}`,
    timeOnly: `${formattedTime} ${timezone}`,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
