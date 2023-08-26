import { ResultSetHeader } from 'mysql2';
import { ThingRecord, ThingGroupRecord } from '../types'
import { db } from './database';

const INSERT_INTO_THING_GROUP_SQL = `
insert into ThingGroup values(NULL, ?, ?);
`
const GET_THING_GROUP_SQL = `
select 	   tg.userId,
		       tg.thingGroupId,
           tg.name as groupName,
		       t.thingId,
           t.name as thingName,
           t.goal,
           a.actionId,
           a.name as actionName,
           a.value as actionValue,
           a.type as actionType
from 	     ThingGroup tg
left join  Thing t
		  on   tg.thingGroupId = t.thingGroupId
left join  ThingAction ta
	   on  ta.thingId = t.thingId
left join  Action a
       on  ta.actionId = a.actionId
where 	   tg.userId = ?
order by   1, 2, 4
`

const UPDATE_THING_GROUP_SQL = `
UPDATE ThingGroup set name = ? where thingGroupId = ? and userId = ?;
`

const DELETE_THING_GROUP_SQL = `
DELETE tg, t, ta, th
FROM ThingGroup tg
LEFT JOIN Thing t          on tg.thingGroupID = t.thingGroupId
LEFT JOIN ThingAction ta   on t.thingId = ta.thingId
LEFT JOIN ThingHistory th  on t.thingID = th.thingId
WHERE tg.userId = ?
AND tg.thingGroupId = ?;
`

export async function insertGroupForUser(userId: number, groupName: string) {
  const existingGroups = await getGroupsWithThingsAndActionsForUser(userId);
  const foundGroup = existingGroups.some(g => g.groupName.toLowerCase() === groupName.toLowerCase());
  if (foundGroup) {
    throw new Error(`Error inserting into groups!  Group name ${groupName} already exists for user ${userId}`);
  }

  return db.promise().query<ResultSetHeader>(INSERT_INTO_THING_GROUP_SQL, [userId, groupName])
  .then(async ([rows,fields]) => {
    if (rows.affectedRows === 1) {
        return;
    }

    throw new Error(`Error inserting into groups for userId:${userId} groupName:${groupName}!  Expected 1 inserted row, recieved ${rows.affectedRows}`);
  });
}

export async function getGroupsWithThingsAndActionsForUser(userId: number): Promise<ThingGroupRecord[]> {
  return db.promise().query<ThingGroupRecord[]>(GET_THING_GROUP_SQL, [userId])
  .then(async ([rows,fields]) => {
    return rows;
  });
}

export async function deleteGroupForUser(userId: number, groupId: number) {
  return db.promise().query<ResultSetHeader>(DELETE_THING_GROUP_SQL, [userId, groupId])
  .then(async ([rows, fields]) => {
    return rows.affectedRows;
  });
}

export async function updateGroupForUser(userId: number, groupId: number, groupName: string) {
  return db.promise().query<ResultSetHeader>(UPDATE_THING_GROUP_SQL, [groupName, groupId, userId])
  .then(async ([rows, fields]) => {
    return rows.affectedRows;
  });
}
