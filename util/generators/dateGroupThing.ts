import { IDateThingGroup } from "../../types";
import { getDateStringsInPastXDays } from "../date";
import { generateThingGroups } from "./thingGroup";

export const generateSkeletonDateGroupThings = (numberOfDays: number = 2): IDateThingGroup[] => {
  const dateThingGroups = getDateStringsInPastXDays(numberOfDays).map(d => {
    return {
      date: d,
      groups: generateThingGroups(),
    }
  });

  return dateThingGroups;
}
  