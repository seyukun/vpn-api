import type { NextApiRequest, NextApiResponse } from "next";

import { Logger as Console } from "tslog";
const console = new Console();

interface Status {
  code: number;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Status>
) {
  // console.info(req.headers);
  // res.status(200).json({ name: "John Doe" });
  switch (req.method) {
    case "GET":
      console.info(req.headers);
      res.status(200).json({ code: 200, message: "OK" });
    default:
      res
        .status(405)
        .json({ code: 405, message: "Method is allowed only for GET" });
  }
}
