import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE, ironSessionCookieOptions } from "../../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { insertNewUser } from "../../../lib/users";
import * as EmailValidator from 'email-validator';
import { setTimeout } from "timers/promises";

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
    res.status(200).send(cookiedUser);
  }
}

async function doPost(req: NextApiRequest, res: NextApiResponse<any>) {
  const cookiedUser = req.session.user;
  if (cookiedUser) {
    res.status(401).send({});
    return;
  }

  // sleep 3 sec as a way to prevent hammering the login api.  System will run out of resources/memory/connections before meaningfully allowing brute force.
  await setTimeout(3000);

  const secretCode = req.body.secret;
  if (secretCode && secretCode?.toLowerCase() === process.env.NEW_ACCOUNT_SERET_PASSWORD?.toLowerCase()) {
    const newEmail = req.body.email;
    const newPassword = req.body.password;

    if (!newEmail || !newPassword) {
      res.status(400).send({ error: "required inputs not provided" });
      return;
    }

    if (!EmailValidator.validate(newEmail)) {
      res.status(400).send({error: `Email address must contain '@'`});
    }

    if (newPassword.length < parseInt(process.env.PASSWORD_COMPLEXITY_MIN_LENGTH || '0')) {
      res.status(400).send({error: `Password complexity min length: ${process.env.PASSWORD_COMPLEXITY_MIN_LENGTH}, this password length: ${newPassword.length}`});
      return;
    }

    await insertNewUser(newEmail, newPassword, DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE);

    res.status(200).send({});
  }
  else {
    res.status(404).send({});
  }
}