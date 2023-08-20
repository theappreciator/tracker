import { ResultSetHeader } from 'mysql2';
import { ActionRecord, ThingActionRecord } from '../types'
import { db } from './database';

const THING_ACTION_SQL = `
select     ta.thingId,
           a.actionId,
           a.name, 
           a.value
from       Action a
inner join ThingAction ta
        on a.actionId = ta.actionId
where      ta.thingId in (?);
`;

const ALL_ACTION_SQL = `
select    *
from      Action a
order by  a.actionId
`;

const DELETE_ACTIONS_FOR_THING_SQL = `
delete from ThingAction where thingId = ?;
`

const INSERT_ACTIONS_FOR_THING_SQL = `
insert into ThingAction values(?, ?);
`

export async function getActionsForThings(thingIds: number[]): Promise<ThingActionRecord[]> {
  if (thingIds.length) {
    return db.promise().query<ThingActionRecord[]>(THING_ACTION_SQL, [ thingIds ])
    .then(async ([rows,fields]) => {
      return rows;
    });
  }
  else {
    return [];
  }
}

export async function getAllActions(): Promise<ActionRecord[]> {
  return db.promise().query<ActionRecord[]>(ALL_ACTION_SQL)
    .then(async ([rows,fields]) => {
      return rows;
    });
}

export async function updateActionsForThing(thingId: number, actionIds: number[]) {
  return db.promise().query<ResultSetHeader>(DELETE_ACTIONS_FOR_THING_SQL, [thingId])
  .then(async ([rows,fields]) => {
    const runInserts = actionIds.map(a => {
      return db.promise().query<ResultSetHeader>(INSERT_ACTIONS_FOR_THING_SQL, [thingId, a]);
    });
    let success = false;
    await Promise.all(runInserts).then(() => success = true);
    return success;
  });
}
