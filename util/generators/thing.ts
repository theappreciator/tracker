import { IThing } from "../../types";
import { generateSkeletonActions } from "./action";

export const generateSkeletonThings = (): IThing[] => {
    const skeletonThings: IThing[] = [
      {
        thingId: 1,
        thingName: 'skeleton',
        groupName: 'skeleton',
        date: '2023/08/18',
        count: 0,
        goal: 0,
        actions: generateSkeletonActions()
      },
      {
        thingId: 2,
        thingName: 'skeleton',
        groupName: 'skeleton',
        date: '2023/08/18',
        count: 0,
        goal: 0,
        actions: generateSkeletonActions()
      }
    ];

  return skeletonThings;
}