import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";
import { getLoggingInUser } from "../../lib/users";
import { CookieUser } from "../../types";
import { setTimeout } from 'timers/promises'

export default withIronSessionApiRoute(

  async function loginRoute(req, res) {
    // sleep 1 sec as a way to prevent hammering the login api
    await setTimeout(1000);
    const user = await getLoggingInUser(req.body.email, req.body.password);
    if (!user) {
        req.session.destroy();
        res.status(401).send({});
    }
    else {
        req.session.user = {
            userId: user.userId,
            email: user.email,
        }
        await req.session.save();
        res.send({dashboard: `/u/${user.email}`});
    }
  }, ironSessionCookieOptions,
);

declare module 'iron-session' {
  interface IronSessionData {
    user?: CookieUser
  }
}