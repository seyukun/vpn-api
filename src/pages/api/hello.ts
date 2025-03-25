import type { NextApiRequest, NextApiResponse } from "next";

import { Logger as Console } from "tslog";
const console = new Console();

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.info(req.headers);
  res.status(200).json({ name: "John Doe" });
}
