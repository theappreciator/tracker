import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { getLoggingInUser } from "../../lib/users";
import { CookieUser } from "../../types";
import { setTimeout } from 'timers/promises'
import { insertHistoryForThing } from "../../lib/history";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllActions } from "../../lib/actions";
import { translateActionRecordsToInterface } from "../../util/translators/action";

export default withIronSessionApiRoute(
  async function historyRoute(req, res) {
    switch (req.method) {
      case 'POST':
        await doPost(req, res);
        break;
      case 'GET':
      default:
        res.status(404).send({});
    }

  }, ironSessionCookieOptions,
);

async function doPost(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;

  if (!cookiedUser) {
    req.session.destroy();
    res.status(401).send({});
  }
  else {
    await setTimeout(2000);
    const payload = {
      thingId: req.body.thingId,
      count: req.body.count,
    }
    await insertHistoryForThing(payload.thingId, payload.count);
    res.status(200).send({});
  }
}
