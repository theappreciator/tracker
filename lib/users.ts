import { UserRecord } from '../types'
import * as argon2 from "argon2";
import { db } from './database';
import { ResultSetHeader } from 'mysql2';

const USER_SQL = `
SELECT *
FROM   User u
where  lower(u.email) = lower(?);
`

const INSERT_USER_SQL = `
insert into User values(NULL, ?, ?, ?, ?);
`

export async function getLoggingInUser(email: string, password: string): Promise<UserRecord | undefined> {
  const user = await getUser(email);
  if (!user) {
    return undefined;
  }

  const match = await argon2.verify(user.hash, password);
  if (match) {
    return user;
  }

  return undefined;

}

export async function insertNewUser(email: string, password: string, locale: string, timezone: string): Promise<void> {
  const existingUser = await getUser(email);
  if (existingUser) {
    throw new Error(`Error inserting into users!  Email ${email} already exists!`);
  }

  const hashedPassword = await argon2.hash(password);
  return db.promise().query<ResultSetHeader>(INSERT_USER_SQL, [email.toLowerCase(), hashedPassword, locale, timezone])
  .then(async ([rows,fields]) => {
    if (rows.affectedRows === 1) {
        return;
    }

    throw new Error(`Error inserting into users!  Expected 1 inserted row, recieved ${rows.affectedRows}`);
  });
}

export async function getUser(email: string): Promise<UserRecord | undefined> {
  return db.promise().query<UserRecord[]>(USER_SQL, [email.toLowerCase()])
  .then(async ([rows,fields]) => {
    if (rows.length === 1) {
      return rows[0];
    }
    else if (rows.length === 0) {
      return undefined;
    }

    throw new Error(`Error getting user!  Expected 1 result match, recieved ${rows.length}`);
  });
}
