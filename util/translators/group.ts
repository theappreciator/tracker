import _ from "lodash";
import { IAction, IDateThingGroup, IThing, IThingGroup, ThingActionRecord, ThingGroupRecord, ThingRecord } from "../../types";
import { format, startOfToday, sub } from "date-fns";

export const translateThingGroupRecordToInterface = (records: ThingGroupRecord[]): IThingGroup[] => {
    const thingGroups: IThingGroup[] = _(records)
      .groupBy(r => r.thingGroupId)
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
              groupName: foundValue.groupName,
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

export const translateThingRecordToInterface = (records: ThingRecord[], actionsForThings: ThingActionRecord[], fillInDatesSince?: Date): IDateThingGroup[] => {
  if (!fillInDatesSince) {
    fillInDatesSince = sub(startOfToday(), { days: 7 });
  };

  const allGroupThingIds = _(records)
    .groupBy(r => r.thingGroupId)
    .map((groupValueArray, groupKey) => {
      return {
        groupId: parseInt(groupKey),
        thingIds: groupValueArray.map(v => v.thingId)
      }
    })
    .value();

  const dateThingGroups: IDateThingGroup[] = _(records)
    .groupBy(r => r.date)
    .map((dateValueArray, dateKey) => {
      const groups: (IThingGroup | undefined)[] = _(dateValueArray)
      .groupBy(r => r.thingGroupId)
      .map((groupValueArray, groupKey) => {
        const things: (IThing | undefined)[] = _(groupValueArray)
          .groupBy(v => v.thingId)
          .map((thingValueArray, thingKey) => {
            if (!thingValueArray.some(v => v.thingId)) {
              return;
            }
            const actions: IAction[] = actionsForThings.filter(a => a.thingId.toString() === thingKey).map(a => {
              return {
                actionId: a.actionId,
                name: a.name,
                value: a.value,
              }
            });
            const foundThingValue = thingValueArray.find(v=> v.thingId.toString() === thingKey);
            if (!foundThingValue) {
              throw new Error(`Error in translateThingRecordToInterface: no found value in thingValueArray`);
            }
            return {
              thingId: foundThingValue.thingId,
              thingName: foundThingValue.thingName,
              groupName: foundThingValue.groupName,
              date: dateKey,
              count: foundThingValue.count || 0,
              actions: actions
            };
          })
          .value();

        allGroupThingIds.forEach(({groupId, thingIds}) => {
          if (groupId.toString() === groupKey) {
            thingIds.forEach(thingId => {
              if (!things.some(t => t?.thingId === thingId)) {
                const foundThingValue = records.find(v => v.thingId === thingId);
                if (!foundThingValue) {
                  throw new Error(`Error in translateThingRecordToInterface: no found value in thingValueArray to fill in missing things`);
                }
                const actions: IAction[] = actionsForThings.filter(a => a.thingId === thingId).map(a => {
                  return {
                    actionId: a.actionId,
                    name: a.name,
                    value: a.value,
                  }
                });
                const pushThing = {
                  thingId: foundThingValue.thingId,
                  thingName: foundThingValue.thingName,
                  groupName: foundThingValue.groupName,
                  date: dateKey,
                  count: 0,
                  actions: actions,
                };
                things.push(pushThing);
              }
            });
          }
        });

        const foundGroupValue = groupValueArray.find(v => v.thingGroupId.toString() === groupKey);
        if (!foundGroupValue) {
          throw new Error(`Error in translateThingGroupRecordToInterface: no found value in groupValueArray`);
        }
        return {
          userId: foundGroupValue.userId,
          groupId: parseInt(groupKey),
          groupName: foundGroupValue?.groupName,
          things: (things.length > 0 && things[0]) ? things as IThing[] : []
        };
      })
      .value();

      allGroupThingIds.forEach(({groupId, thingIds}) => {
        if (!groups.some(g => g?.groupId === groupId)) {
          const foundGroupValue = records.find(v => v.thingGroupId === groupId);
          if (!foundGroupValue) {
            throw new Error(`Error in translateThingRecordToInterface: no found value in foundGroupValue to fill in missing groups`);
          }
          const things = thingIds.map(tid => {
            const foundThingValue = records.find(v => v.thingId === tid);
            if (!foundThingValue) {
              throw new Error(`Error in translateThingRecordToInterface: no found value in foundThingValue to fill in missing things in groups`);
            }

            const actions: IAction[] = actionsForThings.filter(a => a.thingId === tid).map(a => {
              return {
                actionId: a.actionId,
                name: a.name,
                value: a.value,
              }
            });

            const pushThing = {
              thingId: foundThingValue.thingId,
              thingName: foundThingValue.thingName,
              groupName: foundThingValue.groupName,
              date: dateKey,
              count: 0,
              actions: actions,
            };
            return pushThing;
          });

          const pushGroup: IThingGroup = {
            userId: foundGroupValue.userId,
            groupId,
            groupName: foundGroupValue.groupName,
            things: things
          }
          
          groups.push(pushGroup);
        }
      });

      return {
        date: dateKey,
        groups: (groups.length > 0 && groups[0]) ? groups as IThingGroup[] : []
      };
    })
    .value();

    const allDates = new Set<string>(dateThingGroups.map(d => d.date));
    let workdate: Date = startOfToday();
    while (workdate >= fillInDatesSince) {
      allDates.add(format(workdate, 'yyyy/MM/dd'));
      workdate = sub(workdate, { days: 1 });
    }

    const todayGroup = dateThingGroups.find(d => d.date === format(startOfToday(), 'yyyy/MM/dd'));
    if (!todayGroup) {
      throw new Error(`Error in translateThingRecordToInterface: no found value in todayGroup`);
    }
    allDates.forEach(dateKey => {
      if (!dateThingGroups.some(dtg => dtg.date === dateKey)) {
        const clonedGroups = _.cloneDeep(todayGroup.groups);
        clonedGroups.forEach(g => {
          g.things.forEach(t => {
            t.count = 0;
            t.date = dateKey
          })
        });
        dateThingGroups.push({date: dateKey, groups: clonedGroups});
      }
    });

    dateThingGroups.sort((a, b) => {
      if (!a?.date && !b?.date) {
        return 0;
      }
      else if (!b?.date) {
        return -1;
      }
      else if (!a?.date) { 
        return 1;
      }
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    })

    

    return dateThingGroups;
}