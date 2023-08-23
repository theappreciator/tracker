import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE } from "../constants";

export const getTodayDateCorrectedForTimezone = (locale: string, timezone: string): string => {
  return getDateCorrectedForTimezone(new Date(), locale, timezone);
}

export const getDateCorrectedForTimezone = (date: Date, locale: string, timezone: string) => {
  const dateString = getDateStringCorrectedForTimezone(date, locale, timezone);
  return convertDateStringMmDdYyyyToYyyyMmDd(dateString);
}

export const getDateStringCorrectedForTimezone = (date: Date, locale: string, timezone: string): string => {
  const dateConverted = date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
    hour12: false,
  }); // Need to check if this works after 8p

  return dateConverted;
}

export const convertDateStringMmDdYyyyToYyyyMmDd = (mmDdYyyyDateString: string): string => {
  const dateConvertedSplit = mmDdYyyyDateString.split('/');
  const year = dateConvertedSplit[2];
  const month = dateConvertedSplit[0];
  const day = dateConvertedSplit[1];
  return `${year}-${month}-${day}`
}

export const isDateStrEqualToToday = (dateStr: string | undefined): boolean => {
  if (!dateStr) {
    return false;
  }
  const today = getTodayDateCorrectedForTimezone(DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE);
  return today === dateStr;
}
