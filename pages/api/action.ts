import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllActions, updateActionsForThing } from "../../lib/actions";
import { translateActionRecordsToInterface } from "../../util/translators/action";
import { setTimeout } from "timers/promises";

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
    const actions = translateActionRecordsToInterface(records);
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
    const thingId = req.body.thingId;
    const actionIds = req.body.actionIds;
    await updateActionsForThing(thingId, actionIds)
    res.status(200).send({});
  }
}
