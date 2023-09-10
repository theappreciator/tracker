import { ActionType, IAction } from "../../types";


export const generateSkeletonActions = (): IAction[] => {
  const actions = [1,2,3].map(n => {
    return {
      actionId: n,
      name: `skeleton-${n}`,
      value: 0,
      type: ActionType.count
    }
  });

  return actions;
}