import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE } from "../constants";
import { sub } from "date-fns";
import { IDateThingGroup } from "../types";

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

export const getDateStringsInPastXDays = (numberOfDays: number): string[] => {
  const fillInDatesSince = sub(new Date(), { days: numberOfDays });

  const allDatesToFill = new Set<string>();
  let workdate: Date = new Date();
  while (workdate >= fillInDatesSince) {
    allDatesToFill.add(getDateCorrectedForTimezone(workdate, DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE))
    workdate = sub(workdate, { days: 1 });
  }

  return Array.from(allDatesToFill);
}

export const dateThingGroupAscendingSorter = (a: IDateThingGroup, b: IDateThingGroup) => {
  const aDate = new Date(a.date);
  const bDate = new Date(b.date);
  return aDate.getTime() - bDate.getTime();
}

export const dateThingGroupDescendingSorter = (a: IDateThingGroup, b: IDateThingGroup) => {
  const aDate = new Date(a.date);
  const bDate = new Date(b.date);
  return bDate.getTime() - aDate.getTime();
}