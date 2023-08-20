# tracker

# TODO
- Make a name
- Create a flow
- Create way for iOS Shortcut to send data
- Determine how to persist data
- When persisting data, do we need a history?
- Create notion of users (ids and keys?)
- Create notion of things to track, with icons

# Flows
## Send data and display
1. API request received
    1. API: site.com/api/updatething
    1. Payload:
        1. User (id)
        1. Key (password)
        1. ThingID (ex: pushups)
        1. ThingValue (ex: either incremental diff, +20, or total, 80)
1. id/key combo is validated in persisted storage
    1. user string
    1. hashed id/key (ex: argon2)
    1. If hashed input id/key matches stored hash, continue
    1. Else, error
1. Persistent storage is updated wth payload
1. User refreshes UI
    1. If not logged in, then logs in and is redirected back
1. UI gets most up-to-date values from persistant storage

## Visit user their user dashboard to update things
1. User visits specific url, ex: site.com/u/userid
1. User must login somehow (ex: express-session)
    1. If no valid session, must
    1. id/key combo is validated in persisted storage
        1. user string
        1. hashed id/key (ex: argon2)
        1. If hashed input id/key matches stored hash, continue
        1. Else, error
1. User sees inputs for their things
    1. For that users's things
        1. For each thing, display a row (must be good for mobile)
            1. Name
            1. Picture
            1. Current Value for today (assume UTC, converted to ET)
            1. Target Value for today (assumed UTC, converted to ET)
            1. Button to increment
            1. Button to decrement
1. User clicks on update for that thing
    1. Save that action into persistent storage
        1. pass logging in cookie (express-session)
        1. ThingID
        1. ActionType (+1, +5, +10, +20, +25)
        1. ActionTime (assume UTC, converted to ET)
1. UI auto refreshes

## Admin creates a password
1. Admin gets id, key for user
1. Get hash for id + key
1. Saved hash into persistent storage
    1. username (id)
    1. hash of id+key

## User login
1. User visits site.com/u
    1. User's logged in cookie is valid -> redirect to site.com/u/userid
    1. User's logged in cookie not valid -> show login screen
1. Login screen
    1. Fields
        1. Username (id)
        2. Password (key)
    1. Login button
1. User clicks on button
    1. Payload
        1. Username (id)
        1. Password (key)
    1. API hashes id+key and checks peristent storage for 
        1. id
        1. hash
        1. If match, then proceed to site.com/u
        1. If no match, then error

## User attempst to visit user dashboard direct
1. User visits site.com/u/userid
    1. User's logged in cookie is valid && user's id is the path paral for userid -> continue rendering
    1. User's logged in cookie not valid -> redirect to site.com/u

## User creates a password
1. Visits specific, obfuscated url
    1. Requires specific key and value for key in the query params, else returns 404
    1. Admin needs to provide key/value
1. Page is displayed to create a user
    1. Fields
        1. Username (id)
        1. Password (required 10+ characters)
    1. Save button
1. User clicks on save. 
    1. Payload
        1. id
        1. password
    1. API hashes id+key
    1. API saves id + hash to persistent storage
1. User sees success with link to login (site.com/u)

# Appendix

## Data Diagram

```mermaid
erDiagram
    User {
        Int userId PK
        String email
        String hash
    }

    ThingGroup {
        Int thingGroupId PK
        Int userId FK
        String name
    }

    Thing {
        Int thingId PK
        Int thingGroupId FK
        Int sortOrder
        String name
    }

    Action {
        Int actionId PK
        String name
        Int value
    }

    ThingAction {
        Int thingId PK,FK
        Int actionId PK,FK
    }

    ThingHistory {
        Int id PK
        Int thingId FK
        DateTime time
        Int change
    }

    User ||--o{ ThingGroup : ""
    ThingGroup ||--o{ Thing : ""
    Thing ||--o{ ThingHistory : ""
    Thing ||--|{ ThingAction : ""
    ThingAction }o--|| Action : ""
```

## Logins

### Database
| key | val |
|-----|-----|
| branch | `main` |
| role | `admin` |
| username | `********` |
| password | `********` |
| env var: | `DATABASE_URL='mysql://********:********@aws.connect.psdb.cloud/hobby?ssl={"rejectUnauthorized":true}'` |
||
| branch | `development` |
| role | `admin` |
| username | `********` |
| password | `********` |
| env var: | `DATABASE_URL='mysql://********:********@aws.connect.psdb.cloud/hobby?ssl={"rejectUnauthorized":true}'` |

app.js:
```
require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')
connection.end()
```

install packages
```
npm install dotenv mysql2
```

## Queries

### Get Things with Counts
select     tg.name, t.name, coalesce(date(th.time), current_date) as date, coalesce(th.change, 0) as "change"
from       User u
inner join ThingGroup tg
        on u.userId = tg.userId
inner join Thing t
        on tg.thingGroupId = t.thingGroupId
left join  ThingHistory th
        on t.thingId = th.thingId
       and th.time >= CURRENT_DATE
       and th.time < CURRENT_DATE + INTERVAL 1 DAY;