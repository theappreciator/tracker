import { ResultSetHeader } from 'mysql2';
import { ThingRecord } from '../types'
import { db } from './database';

const UPDATE_THING_HISTORY_SQL = `
insert into ThingHistory values(NULL, ?, CURRENT_TIMESTAMP, ?);
`

export async function insertHistoryForThing(thingId: number, count: number) {
  return db.promise().query<ResultSetHeader>(UPDATE_THING_HISTORY_SQL, [thingId, count])
  .then(async ([rows,fields]) => {
    if (rows.affectedRows === 1) {
        return;
    }

    throw new Error(`Error inserting into history!  Expected 1 inserted row, recieved ${rows.affectedRows}`);
  });
}
