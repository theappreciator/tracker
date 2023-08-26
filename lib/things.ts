import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ThingRecord } from '../types'
import { db } from './database';

const THINGS_TODAY_SQL = `
select     x.userId,
           x.thingId,
           x.thingGroupId,
           x.groupName,
           x.thingName,
           x.date,
           (sum(coalesce(x.count, 0)) * 1) as "count",
           max(x.goal) as "goal"
from (
select     u.userId,
           t.thingId,
           tg.thingGroupId,
           tg.name as groupName,
           t.name as thingName,
		       DATE_FORMAT(date(CONVERT_TZ(th.time, 'UTC', 'America/New_York')), '%Y-%m-%d') as date,
		       th.change as "count",
           t.goal
from       User u
inner join ThingGroup tg
        on u.userId = tg.userId
inner join Thing t
        on tg.thingGroupId = t.thingGroupId
	     and t.thingId in (select thingId from ThingAction)
inner join ThingHistory th
        on t.thingId = th.thingId
       and date(CONVERT_TZ(th.time, 'UTC', 'America/New_York')) >= date(CONVERT_TZ(current_timestamp(), 'UTC', 'America/New_York')) - INTERVAL 7 DAY
       and date(CONVERT_TZ(th.time, 'UTC', 'America/New_York')) <  date(CONVERT_TZ(current_timestamp(), 'UTC', 'America/New_York')) + INTERVAL 1 DAY
union all
select     u.userId,
           t.thingId,
           tg.thingGroupId,
           tg.name as groupName,
           t.name as thingName,
		       DATE_FORMAT(date(CONVERT_TZ(current_timestamp(), 'UTC', 'America/New_York')), '%Y-%m-%d') as date,
		       0,
           t.goal
from       User u
inner join ThingGroup tg
        on u.userId = tg.userId
inner join Thing t
        on tg.thingGroupId = t.thingGroupId
	     and t.thingId in (select thingId from ThingAction)
) x
where      x.userId = ?
group by   x.userId,
           x.thingId,
           x.thingGroupId,
           x.groupName,
           x.thingName,
           x.date
`

const THINGS_ALL_SQL = `
select     u.userId,
           t.thingId,
           tg.thingGroupId,
           tg.name as groupName,
           t.name as thingName,
           DATE_FORMAT(coalesce(date(th.time), current_date), '%Y-%m-%d') as date,
           coalesce(th.change, 0) as "count"
from       User u
inner join ThingGroup tg
        on u.userId = tg.userId
inner join Thing t
        on tg.thingGroupId = t.thingGroupId
left join  ThingHistory th
        on t.thingId = th.thingId
where      u.userId = ?;
`

const INSERT_NEW_THING_SQL = `
insert into Thing values(NULL, ?, 1, ?, ?);
`

const UPDATE_THING_SQL = `
UPDATE Thing t
JOIN   ThingGroup tg on tg.thingGroupID = t.thingGroupId
SET    t.name = ?,
       t.goal = ?
WHERE  tg.userId = ?
AND    t.thingId = ?;
`

const DELETE_THING_SQL = `
DELETE t, ta, th
FROM Thing t
JOIN ThingGroup tg         on tg.thingGroupID = t.thingGroupId
LEFT JOIN ThingAction ta   on t.thingId = ta.thingId
LEFT JOIN ThingHistory th  on t.thingID = th.thingId
WHERE tg.userId = ?
AND t.thingId = ?
`

export async function getTodayThingsForUser(userId: number): Promise<ThingRecord[]> {
  return db.promise().query<ThingRecord[]>(THINGS_TODAY_SQL, [ userId ])
  .then(async ([rows,fields]) => {
    return rows;
  });
}

export async function getAllThingsForUser(userId: number): Promise<ThingRecord[]> {
  return db.promise().query<ThingRecord[]>(THINGS_ALL_SQL, [ userId ])
  .then(async ([rows,fields]) => {
    return rows;
  });
}

export async function insertNewThingForUser(userId: number, thingGroupId: number, thingName: string, goal: number) {

  const existingThings = await getAllThingsForUser(userId);
  const foundThing = existingThings.some(t => t.thingName.toLowerCase() === thingName.toLowerCase());
  if (foundThing) {
    throw new Error(`Error inserting into things!  Thing name ${thingName} already exists for user ${userId}`);
  }

  return db.promise().query<ResultSetHeader>(INSERT_NEW_THING_SQL, [thingGroupId, thingName, goal])
  .then(async ([rows,fields]) => {
    if (rows.affectedRows === 1) {
        return;
    }

    throw new Error(`Error inserting into things!  Expected 1 inserted row, recieved ${rows.affectedRows}`);
  });
}

export async function updateThingForUser(userId: number, thingId: number, thingName: string, goal: number) {
  return db.promise().query<ResultSetHeader>(UPDATE_THING_SQL, [thingName, goal, userId, thingId])
  .then(async ([rows, fields]) => {
    return rows.affectedRows;
  });
}

export async function deleteThingForUser(userId: number, thingId: number) {
  return db.promise().query<ResultSetHeader>(DELETE_THING_SQL, [userId, thingId])
  .then(async ([rows, fields]) => {
    return rows.affectedRows;
  });
}
      