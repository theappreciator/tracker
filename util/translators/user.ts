import { CookieUser, UserRecord } from "../../types"


export const translateUserRecordToInterface = (userRecord: UserRecord): CookieUser => { 
    const cookieUser: CookieUser = {
        userId: userRecord.userId,
        email: userRecord.email,
        locale: userRecord.locale,
        timezone: userRecord.timezone
    }

    return cookieUser;
}