import { ActionType, IAction } from "../../types";


export const generateSkeletonActions = (): IAction[] => {
  const actions = [
    {
      actionId: 1,
      name: "skeleton",
      value: 0,
      type: ActionType.count
    }
  ];

  return actions;
}