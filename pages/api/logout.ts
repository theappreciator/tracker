import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionCookieOptions } from "../../constants";

export default withIronSessionApiRoute(
  async function logoutRoute(req, res) {
      req.session.destroy();
      res.status(200).send({});
    }, ironSessionCookieOptions,
);