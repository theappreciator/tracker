import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { DEFAULT_DAYS_BACK, ironSessionCookieOptions } from "../../../constants";
import { getLoggingInUser } from "../../../lib/users";
import { CookieUser } from "../../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { getThingsForUser, getTodayThingsForUser, insertNewThingForUser } from "../../../lib/things";
import { getActionsForThings } from "../../../lib/actions";
import { translateThingRecordToDateThingGroupInterface } from "../../../util/translators/group";

export default withIronSessionApiRoute(
  async function thingRoute(req, res) {
    switch (req.method) {
      case 'GET':
        await doGet(req, res);
        break;
      case 'POST':
        await doPost(req, res);
        break;
      default:
        res.status(404).send({});
    }

  }, ironSessionCookieOptions,
);

async function doGet(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;
  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    const daysBack = +(typeof req.query.days === "string" ? req.query.days : DEFAULT_DAYS_BACK);
    const thingRecords = await getThingsForUser(cookiedUser.userId, daysBack);
    const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
    const things = translateThingRecordToDateThingGroupInterface(thingRecords, actionsForThings, daysBack);
    res.status(200).send(things);
  }
}

async function doPost(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;
  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    const thingGroupId = req.body.thingGroupId;
    const thingName = req.body.thingName;
    const thingGoal = req.body.goal;
    await insertNewThingForUser(cookiedUser.userId, thingGroupId, thingName, thingGoal);
      
    const thingRecords = await getTodayThingsForUser(cookiedUser.userId);
    const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
    const things = translateThingRecordToDateThingGroupInterface(thingRecords, actionsForThings);
    res.status(200).send(things);
  }
}
