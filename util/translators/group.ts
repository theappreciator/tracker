import _ from "lodash";
import { ActionType, IAction, IDateThingGroup, IThing, IThingGroup, ThingActionRecord, ThingGroupRecord, ThingRecord } from "../../types";
import { format, sub } from "date-fns";
import { format as formatTZ, utcToZonedTime } from "date-fns-tz";
import { dateThingGroupDescendingSorter, getDateCorrectedForTimezone, getDateStringsInPastXDays, getTodayDateCorrectedForTimezone } from "../date";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE } from "../../constants";
import { groupEnd } from "console";


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
                type: ActionType.unspecified,
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
    fillInDatesSince = sub(new Date(), { days: 7 });
  };

  // Get all unique groups and things in those groups.
  // The record set may be missing dates, or things for those dates if there were no ThingHistory items for that date, so we are going to fill them in here.
  const allGroupThingIds = _(records)
    .groupBy(r => r.thingGroupId)
    .map((groupValueArray, groupKey) => {
      return {
        groupId: parseInt(groupKey),
        thingIds: Array.from(new Set(groupValueArray.map(v => v.thingId))),
      }
    })
    .value();

  const dateThingGroups: IDateThingGroup[] = _(records)
    // Group by date.  Result: an array of dates, containing groups
    .groupBy(r => r.date)
    .map((dateValueArray, dateKey) => {
      // For each date, group by ThingGroup.  Result: an array of groups, containing things.
      const groups: IThingGroup[] = _(dateValueArray)
      .groupBy(r => r.thingGroupId)
      .map((groupValueArray, groupKey) => {
        // Get any instance of this ThingGroup to use for reference
        const foundGroupValue = groupValueArray.find(v => v.thingGroupId.toString() === groupKey);
        if (!foundGroupValue) {
          throw new Error(`Error in translateThingGroupRecordToInterface: no found value in groupValueArray`);
        }

        // For each ThingGroup, group by Thing.  Result: an array of Things
        const things: IThing[] = _(groupValueArray)
          .groupBy(v => v.thingId)
          .map((thingValueArray, thingKey) => {
            // Get the instance of this Thing for this id.  There will only be 1 match since we are searching within this ThingGroup for this date.
            const foundThingValue = thingValueArray.find(v=> v.thingId.toString() === thingKey);
            if (!foundThingValue) {
              throw new Error(`Error in translateThingRecordToInterface: no found value in thingValueArray`);
            }
            // Get this Actions for this Thing.
            const actions: IAction[] = actionsForThings.filter(a => a.thingId === foundThingValue.thingId).map(a => {
              return {
                actionId: a.actionId,
                name: a.name,
                value: a.value,
                type: a.type,
              }
            });
            return {
              thingId: foundThingValue.thingId,
              thingName: foundThingValue.thingName,
              groupName: foundThingValue.groupName,
              date: dateKey,
              count: +foundThingValue.count || 0, //for some reason the Record here is coming back as a string, so force it to a number
              actions: actions
            };
          })
          .value();

        // Fill in missing Things for this ThingGroup.  This is normal when there is no ThingHistory for this date for this Thing.
        const allThingsIdsForThisGroup: number[] = allGroupThingIds.find(a => a.groupId === foundGroupValue.thingGroupId)?.thingIds || [];
        const missingThingIds: number[] = allThingsIdsForThisGroup.filter(id => !things.some(t => t?.thingId === id)) || [];

        const thingsToFillIn: IThing[] = missingThingIds.map(id => {
          // Get any instance of this Thing for this id, just to use for reference
          const foundThingValue = records.find(v => v.thingId === id);
            if (!foundThingValue) {
              throw new Error(`Error in translateThingRecordToInterface: no found value in thingValueArray to fill in missing things`);
            }
            // Get the Actions for this Thing.
            const actions: IAction[] = actionsForThings.filter(a => a.thingId === foundThingValue.thingId).map(a => {
              return {
                actionId: a.actionId,
                name: a.name,
                value: a.value,
                type: a.type,
              }
            });
            return {
              thingId: foundThingValue.thingId,
              thingName: foundThingValue.thingName,
              groupName: foundThingValue.groupName,
              date: dateKey,
              count: 0,
              actions: actions,
            };
        });
        thingsToFillIn.forEach(f => things.push(f));

        return {
          userId: foundGroupValue.userId,
          groupId: foundGroupValue.thingGroupId,
          groupName: foundGroupValue.groupName,
          things: things,
        };
      })
      .value();

      // Fill in missing ThingGroups for this date.  This is normal when there is no ThingHistory for this date for Things in this ThingGroup.
      const allMissingGroupIds: number[] = allGroupThingIds.map(g => g.groupId).filter(id => !groups.some(g => g?.groupId === id));
      const groupsToFillIn: IThingGroup[] = allMissingGroupIds.map(gid => {
        // Get any instance of this ThingGround for this id, just to use for reference
        const foundGroupValue = records.find(v => v.thingGroupId === gid);
        if (!foundGroupValue) {
          throw new Error(`Error in translateThingRecordToInterface: no found value in foundGroupValue to fill in missing groups`);
        }

        const allThingsIdsForThisGroup = allGroupThingIds.find(g => g.groupId === gid)?.thingIds || [];
        const things: IThing[] = allThingsIdsForThisGroup.map(tid => {
          // Get any instance of this Thing for this id, just to use for reference
          const foundThingValue = records.find(v => v.thingId === tid);
          if (!foundThingValue) {
            throw new Error(`Error in translateThingRecordToInterface: no found value in foundThingValue to fill in missing things in groups`);
          }
          // Get the Actions for this Thing.
          const actions: IAction[] = actionsForThings.filter(a => a.thingId === tid).map(a => {
            return {
              actionId: a.actionId,
              name: a.name,
              value: a.value,
              type: a.type
            }
          });
          return {
            thingId: foundThingValue.thingId,
            thingName: foundThingValue.thingName,
            groupName: foundThingValue.groupName,
            date: dateKey,
            count: 0,
            actions: actions,
          };
        });

        return {
          userId: foundGroupValue.userId,
          groupId: foundGroupValue.thingGroupId,
          groupName: foundGroupValue.groupName,
          things: things
        }
      });
      groupsToFillIn.forEach(g => groups.push(g));

      return {
        date: dateKey,
        groups,
      };
    })
    .value();

    // Fill in missing dates.  This is normal when there is no ThingHistory for this date
    const allDatesToFill = getDateStringsInPastXDays(7);
    const searchDate = getTodayDateCorrectedForTimezone(DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE);
    // Get today's date in case we need a reference  We know the SQL data will always return full data for today.
    const todayGroupsForReference = dateThingGroups.find(d => d.date === searchDate);
    if (!todayGroupsForReference) {
      throw new Error(`Error in translateThingRecordToInterface: no found value in todayGroup`);
    }

    const missingDatesToFillIn: string[] = Array.from(allDatesToFill).filter(d => !dateThingGroups.some(tg => tg.date === d));
    const missingDateThingGroups: IDateThingGroup[] = missingDatesToFillIn.map(d => {
      const thingGroups: IThingGroup[] = _.cloneDeep(todayGroupsForReference.groups).map(g => {
        return {
          ...g,
          things: g.things.map(t => {
            return {
              ...t,
              count: 0,
              date: d
            }
          })
        }
      });
      
      return {
        date: d,
        groups: thingGroups
      }
    });
    missingDateThingGroups.forEach(d => {
      dateThingGroups.push(d);
    })

    // And finally, sort by date descending
    dateThingGroups.sort(dateThingGroupDescendingSorter);

    return dateThingGroups;
}