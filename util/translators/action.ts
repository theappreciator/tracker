import { ActionRecord, IAction } from "../../types";


export const translateActionRecordToInterface = (record: ActionRecord): IAction => {
  return {
    actionId: record.actionId,
    name: record.name,
    value: record.value,
    type: record.type
  }
}
export const translateActionRecordsToInterface = (records: ActionRecord[]): IAction[] => {
  const actions: IAction[] = records.map(r => translateActionRecordToInterface(r));
  return actions;
}
