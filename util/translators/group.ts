import _ from "lodash";
import { IAction, IThing, IThingGroup, ThingGroupRecord } from "../../types";

export const translateThingGroupRecordToInterface = (records: ThingGroupRecord[]): IThingGroup[] => {
    const thingGroups: IThingGroup[] = _(records)
      .groupBy(r => (r.thingGroupId))
      .map((groupValueArray, groupKey) => {
        const things: (IThing | undefined)[] = _(groupValueArray)
          .groupBy(v => v.thingId)
          .map((thingValueArray, thingKey) => {
            if (!thingValueArray.some(v => v.thingId)) {
              return;
            }
            const actions: IAction[] = thingValueArray.filter(t => t.actionId).map(t => {
              return {
                actionId: t.actionId,
                name: "XX",
                value: 0,
              }
            })
            const foundValue = thingValueArray.find(v=> v.thingId.toString() === thingKey);
            if (!foundValue) {
              throw new Error(`Error in translateThingGroupRecordToInterface: no found value in thingValueArray`);
            }
            return {
              thingId: parseInt(thingKey),
              thingName: foundValue.thingName,
              actions: actions
            };
          })
          .value();
        const foundValue = groupValueArray.find(v => v.thingGroupId.toString() === groupKey);
        if (!foundValue) {
          throw new Error(`Error in translateThingGroupRecordToInterface: no found value in groupValueArray`);
        }
        return {
          userId: foundValue.userId,
          groupId: parseInt(groupKey),
          groupName: foundValue?.groupName,
          things: (things.length > 0 && things[0]) ? things as IThing[] : []
        };
      })
      .value();

    return thingGroups;
}