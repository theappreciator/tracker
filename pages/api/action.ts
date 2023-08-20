import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { getLoggingInUser } from "../../lib/users";
import { CookieUser } from "../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllActions, updateActionsForThing } from "../../lib/actions";
import { translateActionRecordToInterface } from "../../util/translators/action";

export default withIronSessionApiRoute(
  async function actionRoute(req, res) {
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
    const records = await getAllActions();
    const actions = translateActionRecordToInterface(records);
    res.status(200).send(actions);
  }
}

async function doPost(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;

  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    console.log(req.body);
    const thingId = req.body.thingId;
    const actionIds = req.body.actionIds;
    console.log(thingId, actionIds);
    await updateActionsForThing(thingId, actionIds)
    res.status(200).send({});
  }
}
