import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { getLoggingInUser } from "../../lib/users";
import { CookieUser } from "../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { getTodayThingsForUser, insertNewThingForUser } from "../../lib/things";
import { getActionsForThings } from "../../lib/actions";
import { translateThingRecordToInterface } from "../../util/translators/group";

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
    const thingRecords = await getTodayThingsForUser(cookiedUser.userId);
    const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
    const things = translateThingRecordToInterface(thingRecords, actionsForThings);
    
    const payload = things;
    res.status(200).send(payload);
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
    await insertNewThingForUser(cookiedUser.userId, thingGroupId, thingName);
    res.status(200).send({});
  }
}
