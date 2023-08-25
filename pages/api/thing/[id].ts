import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../../constants";
import { getLoggingInUser } from "../../../lib/users";
import { CookieUser } from "../../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteThingForUser, getTodayThingsForUser, insertNewThingForUser, updateThingForUser } from "../../../lib/things";
import { getActionsForThings } from "../../../lib/actions";
import { translateThingRecordToInterface } from "../../../util/translators/group";

export default withIronSessionApiRoute(
  async function thingRoute(req, res) {
    switch (req.method) {
      case "PUT":
        await doPut(req, res);
        break;
      case "DELETE":
        await doDelete(req, res);
        break;
      case 'GET':
      case 'POST':
      default:
        res.status(404).send({});
    }

  }, ironSessionCookieOptions,
);

async function doPut(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;
  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    if (typeof req.query.id === 'undefined' || Array.isArray(req.query.id)) {
      res.status(400).send({});
    }
    else {
      const thingId = +req.query.id;
      const thingName = req.body.thingName;
      if (!thingName || typeof thingName !== "string") {
        res.status(404).send({});
      }
      else {
        const rows = await updateThingForUser(cookiedUser.userId, thingId, thingName);
        if (rows === 0) {
          res.status(404).send({});
        }
        else {
          const thingRecords = await getTodayThingsForUser(cookiedUser.userId);
          const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
          const things = translateThingRecordToInterface(thingRecords, actionsForThings);
          res.status(200).send(things);
        }
      }
    }
  }
}

async function doDelete(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;
  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    if (typeof req.query.id === 'undefined' || Array.isArray(req.query.id)) {
      res.status(400).send({});
    }
    else {
      const thingId = +req.query.id;
      const rows = await deleteThingForUser(cookiedUser.userId, thingId);
      if (rows === 0) {
        res.status(404).send({});
      }
      else {
        const thingRecords = await getTodayThingsForUser(cookiedUser.userId);
        const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
        const things = translateThingRecordToInterface(thingRecords, actionsForThings);
        res.status(200).send(things);
      }
    }
  }
}
