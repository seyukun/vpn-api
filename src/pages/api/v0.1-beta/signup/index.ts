import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Logger as Console } from "tslog";
import crypto from "crypto";

const console = new Console();
const prisma = new PrismaClient();

interface Status {
  code: number;
  message: string;
  hash?: string;
}

interface UserAuth {
  username: string;
  bearer: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Status | UserAuth>
) {
  const timestamp = new Date().toISOString();

  try {
    const user = await findUserByAuthorization(req.headers.authorization);

    switch (req.method) {
      case "GET":
        if (!user) {
          // Create  User
          const newUser = await prisma.user.create({
            data: {
              username: crypto.randomBytes(16).toString("hex"),
              password: crypto.randomBytes(16).toString("hex"),
              bearer: crypto.randomBytes(64).toString("hex"),
            },
          });

          // Send Response
          res.status(200).json({
            username: newUser.username!,
            bearer: newUser.bearer,
          });

          return;
        } else {
          // Send Response
          res.status(200).json({
            username: user.username,
            bearer: user.bearer,
          });
          return;
        }

      default:
        res.status(405).json({
          code: 405,
          message: "Method is allowed only for GET",
        });
    }
  } catch (e) {
    const message = "Internal Server Error";
    const hash = crypto
      .createHash("md5")
      .update(`${timestamp}:${message}`)
      .digest("hex");
    console.error(hash, e);
    res.status(405).json({
      code: 405,
      message: message,
      hash: hash,
    });
  }
}

async function findUserByAuthorization(authorization: string | undefined) {
  const authorizationSplit = authorization?.split(" ");
  const User =
    authorizationSplit &&
    authorizationSplit.length == 2 &&
    authorizationSplit[0] === "Bearer"
      ? await prisma.user.findUnique({
          where: { bearer: authorizationSplit[1] },
        })
      : null;
  return User;
}
