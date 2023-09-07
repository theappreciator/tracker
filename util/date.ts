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

export const getTimeStringCorrectedForTimezone = (dateStr: string, locale: string, timezone: string): string => {
  const date = new Date(dateStr);
  const dateConverted = date.toLocaleString(locale, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: timezone,
    hour12: true,
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

export const convertDateStringYyyyMmDdToFullNoYear = (dateStr: string) => {
  const fullDateStr = new Date(dateStr).toLocaleString(DEFAULT_USER_LOCALE, { dateStyle: 'full', timeZone: 'UTC'});
  return fullDateStr.split(',').slice(0, 2).join(',');
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
