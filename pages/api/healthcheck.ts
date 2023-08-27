import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    version: string,
    environment: string,
  }

export default function healthRoute(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res.status(200).json({
        version: process.env.npm_package_version || 'n/a',
        environment: 'production'
    })
  }