import { ThingRecord } from "../types";
import { format, sub, add, startOfToday, isEqual } from 'date-fns'


export interface ThingsByGroupAndDate {
  date: string,
  groupsOfThings: {
    groupName: string,
    things: ThingRecord[]
  }[]
}

export const convertToDatesOfGroupsOfThings = (things: ThingRecord[], fillInDatesSince?: Date): ThingsByGroupAndDate[] => {
  if (!fillInDatesSince) {
    fillInDatesSince = sub(startOfToday(), { days: 7 });
  }

  const allDates = new Set<string>();
  let workdate: Date = startOfToday();
  while (workdate >= fillInDatesSince) {
    allDates.add(format(workdate, 'yyyy/MM/dd'));
    workdate = sub(workdate, { days: 1 });
  }
  
  const allGroups = new Set(things.map(t => t.groupName));
  const allThingsIds = new Set(things.map(t => t.thingId));

  return Array.from(allDates).map(d => {
    const groupsOfThings = Array.from(allGroups).map(g => {
      const thingsInGroup: ThingRecord[] = things.filter(t => t.date === d && t.groupName === g);
      Array.from(allThingsIds).forEach(id => {
        const foundThing = (things.find(t => t.thingId === id) as ThingRecord);
        const thing: ThingRecord = {
          ...foundThing,
          count: 0,
          date: d,
        };
        
        const realThingHasThisThingId = thingsInGroup.some(t => t.thingId === id);
        if (!realThingHasThisThingId) {
          thingsInGroup.push(thing);
        }
      });

      return {
        groupName: g,
        things: thingsInGroup
      }
    });
    return {
      date: d,
      groupsOfThings
    }
  });
}