import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { DAYS_BACK_TODAY_ONLY, DEFAULT_DAYS_BACK, ironSessionCookieOptions } from "../../../constants";
import { getLoggingInUser } from "../../../lib/users";
import { CookieUser } from "../../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteThingForUser, getThingHistoryForUser, getTodayThingsForUser, updateThingForUser } from "../../../lib/things";
import { getActionsForThings } from "../../../lib/actions";
import { translateThingRecordToDateThingGroupInterface, translateThingRecordToDateThingGroupInterfaceWithHistory } from "../../../util/translators/group";
import { getQueryParamNumber } from "../../../util/query";

export default withIronSessionApiRoute(
  async function thingRoute(req, res) {
    switch (req.method) {
      case "GET":
        await doGet(req, res);
        break;
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

async function doGet(req: NextApiRequest, res: NextApiResponse<any>) {
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
      const thingId = getQueryParamNumber(req.query.id);
      if (typeof thingId === "undefined") {
        res.status(400).send({});
      }
      else {
        const daysBack = +(typeof req.query.days === "string" ? req.query.days : DAYS_BACK_TODAY_ONLY);
        const thingRecords = await getThingHistoryForUser(cookiedUser.userId, thingId, daysBack);
        const things = translateThingRecordToDateThingGroupInterfaceWithHistory(thingRecords, [], daysBack, true);
        res.status(200).send(things);      
      }
    }
  }
}

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
      const thingGoal = req.body.goal;
      if ((!thingName || typeof thingName !== "string") ||
          ((typeof thingGoal === 'undefined') )) {
        res.status(400).send({});
      }
      else {
        const rows = await updateThingForUser(cookiedUser.userId, thingId, thingName, +thingGoal);
        if (rows === 0) {
          res.status(404).send({});
        }
        else {
          const thingRecords = await getTodayThingsForUser(cookiedUser.userId);
          const actionsForThings = await getActionsForThings(thingRecords.map(t => t.thingId));
          const things = translateThingRecordToDateThingGroupInterface(thingRecords, actionsForThings);
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
        const things = translateThingRecordToDateThingGroupInterface(thingRecords, actionsForThings);
        res.status(200).send(things);
      }
    }
  }
}
