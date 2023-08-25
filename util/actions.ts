import { IThing, IAction, ActionType } from "../types";

export const buttonColor = (thing: IThing, action: IAction) => {
    if (action.type === ActionType.onoff) {
      if (hasCompleted(thing, action)) {
        return 'success';
      }
      return 'error';
    }

    return 'primary'
  }

  export const hasCompleted = (thing: IThing, action: IAction) => {
    switch (action.type) {
      case ActionType.onoff:
        if (thing.count && thing.count > 0)
          return true;
        else
          return false;
        break;
      case ActionType.count: 
      default:
        return undefined
    }
  }

  export const isActionsCountable = (actions: IAction[]) => {
    if (actions.every(a => a.type === ActionType.count)) {
      return true;
    }
    return false;
  }