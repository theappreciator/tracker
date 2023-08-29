import { IThingGroup } from "../../types";
import { generateSkeletonThings } from "./thing";

export const generateThingGroups = (): IThingGroup[] => {
  const skeletonGroups: IThingGroup[] = [
    {
      userId: 1,
      groupId: 1,
      groupName: "skeleton",
      things: generateSkeletonThings(),
    }
  ]

  return skeletonGroups;
}