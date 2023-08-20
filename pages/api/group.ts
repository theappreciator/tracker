import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { getLoggingInUser } from "../../lib/users";
import { CookieUser } from "../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { getTodayThingsForUser } from "../../lib/things";
import { getActionsForThings } from "../../lib/actions";
import { getGroupsWithThingsAndActionsForUser, insertGroupForUser } from "../../lib/groups";
import { translateThingGroupRecordToInterface } from "../../util/translators/group";

export default withIronSessionApiRoute(
  async function groupRoute(req, res) {
    switch (req.method) {
      case 'POST':
        await doPost(req, res);
        break;
      case 'GET':
        await doGet(req, res);
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
    const records = await getGroupsWithThingsAndActionsForUser(cookiedUser.userId);
    const groups = translateThingGroupRecordToInterface(records);
    res.status(200).send(groups);
  }
}

async function doPost(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;

  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    await insertGroupForUser(cookiedUser.userId, req.body.groupName);
    const records = await getGroupsWithThingsAndActionsForUser(cookiedUser.userId);
    const groups = translateThingGroupRecordToInterface(records);
    res.status(200).send(groups);
  }
}
