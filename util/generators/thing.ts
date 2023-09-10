import { IThing } from "../../types";
import { generateSkeletonActions } from "./action";

export const generateSkeletonThings = (): IThing[] => {
    const skeletonThings = [1,2,3,4].map(n => {
      return {
        thingId: n,
        thingName: `skeleton-${n}`,
        groupName: 'skeleton',
        date: '2023/08/18',
        count: 0,
        goal: 0,
        actions: generateSkeletonActions()
      }
    });

  return skeletonThings;
}