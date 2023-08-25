import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteGroupForUser, updateGroupForUser, getGroupsWithThingsAndActionsForUser } from "../../../lib/groups";
import { translateThingGroupRecordToInterface } from "../../../util/translators/group";

export default withIronSessionApiRoute(
  async function groupRoute(req, res) {
    switch (req.method) {
      case 'DELETE':
        await doDelete(req, res);
        break;
      case 'PUT':
        await doPut(req, res);
        break;
      case 'POST':
      case 'GET':
      default:
        res.status(404).send({});
    }

  }, ironSessionCookieOptions,
);

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
      const groupId = +req.query.id;
      const rows = await deleteGroupForUser(cookiedUser.userId, groupId);
      if (rows === 0) {
        res.status(404).send({});
      }
      else {
        const records = await getGroupsWithThingsAndActionsForUser(cookiedUser.userId);
        const groups = translateThingGroupRecordToInterface(records);
        res.status(200).send(groups);
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
      const groupId = +req.query.id;
      const groupName = req.body.groupName;
      if (!groupName || typeof groupName !== "string") {
        res.status(404).send({'a':1});
      }
      else {
        const rows = await updateGroupForUser(cookiedUser.userId, groupId, groupName);
        if (rows === 0) {
          res.status(404).send({'a':2});
        }
        else {
          const records = await getGroupsWithThingsAndActionsForUser(cookiedUser.userId);
          const groups = translateThingGroupRecordToInterface(records);
          res.status(200).send(groups);
        }
      }
    }
  }
}
