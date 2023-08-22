import { ThingRecord } from "../types";
import { format } from 'date-fns'

export interface ThingsByGroupAndDate {
  date: string,
  groupsOfThings: {
    groupName: string,
    things: ThingRecord[]
  }[]
}

export const convertToDatesOfGroupsOfThings = (things: ThingRecord[]): ThingsByGroupAndDate[] => {
  const allDates = new Set(things.map(t => t.date));
  allDates.add(format(new Date(), 'yyyy/MM/dd'));
  const allGroups = new Set(things.map(t => t.groupName));

  return Array.from(allDates).map(d => {
    return {
      date: d,
      groupsOfThings: Array.from(allGroups).map(g => {
        return {
          groupName: g,
          things: things.filter(t => t.date === d && t.groupName === g)
        }
      })
    }
  });
}