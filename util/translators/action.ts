import { ActionRecord, IAction } from "../../types";


export const translateActionRecordToInterface = (records: ActionRecord[]): IAction[] => {
    const actions: IAction[] = records.map(r => {
        return {
            actionId: r.actionId,
            name: r.name,
            value: r.value
        }
    });

    return actions;
}
