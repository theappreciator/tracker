import { MAX_TIER_SIZE } from "../constants";
import { IThing, IAction, ActionType } from "../types";
import { getTierCountsFromSegmentType } from "./thing";

export const buttonColor = (thing: IThing, action: IAction) => {
  if (false && action.type === ActionType.onoff) {
    if (hasCompleted(thing, action)) {
      return 'success';
    }
    return 'error';
  }

  return 'primary'
}

export const hasCompleted = (thing: IThing, action: IAction): boolean | undefined=> {
  switch (action.type) {
    case ActionType.onoff:
      if (thing.count && thing.count > 0)
        return true;
      else if (thing.count && thing.count < 0)
        return true;
      else
        return false;
    case ActionType.segmentFeeling:
    case ActionType.segmentSize:
      const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
      if (tier1 >= MAX_TIER_SIZE ||
          tier2 >= MAX_TIER_SIZE ||
          tier3 >= MAX_TIER_SIZE)
        return true;
      else  
        return false;
    default:
      return undefined
  }
}

export const getActionsType = (actions: IAction[]) => {
  const type = actions.find(a => true)?.type || ActionType.unspecified;
  return type
}
  