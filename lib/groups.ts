import { ResultSetHeader } from 'mysql2';
import { ThingRecord, ThingGroupRecord } from '../types'
import { db } from './database';

const UPDATE_THING_GROUP_SQL = `
insert into ThingGroup values(NULL, ?, ?);
`
const GET_THING_GROUP_SQL = `
select 	   tg.userId,
		       tg.thingGroupId,
           tg.name as groupName,
		       t.thingId,
           t.name as thingName,
           a.actionId
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

export async function insertGroupForUser(userId: number, groupName: string) {
  console.log("About to enter", userId, groupName);

  const existingGroups = await getGroupsWithThingsAndActionsForUser(userId);
  const foundGroup = existingGroups.some(g => g.groupName.toLowerCase() === groupName.toLowerCase());
  if (foundGroup) {
    throw new Error(`Error inserting into groups!  Group name ${groupName} already exists for user ${userId}`);
  }

  return db.promise().query<ResultSetHeader>(UPDATE_THING_GROUP_SQL, [userId, groupName])
  .then(async ([rows,fields]) => {
    if (rows.affectedRows === 1) {
        return;
    }

    throw new Error(`Error inserting into groups!  Expected 1 inserted row, recieved ${rows.affectedRows}`);
  });
}

export async function getGroupsWithThingsAndActionsForUser(userId: number): Promise<ThingGroupRecord[]> {
  return db.promise().query<ThingGroupRecord[]>(GET_THING_GROUP_SQL, [userId])
  .then(async ([rows,fields]) => {
    return rows;
  });
}
