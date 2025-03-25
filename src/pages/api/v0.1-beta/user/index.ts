import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Logger as Console } from "tslog";
import crypto from "crypto";

import { findUserByAuthorization } from "@/lib/prismaHelper";

const console = new Console();
const prisma = new PrismaClient();

interface Status {
  code: number;
  message: string;
  hash?: string;
}

interface User {
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Status | User>
) {
  const timestamp = new Date().toISOString();

  try {
    const user = await findUserByAuthorization(
      prisma,
      req.headers.authorization
    );

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Unauthorized",
      });
    }

    switch (req.method) {
      case "GET":
        // Send Response
        return res.status(200).json({
          username: user.username,
        });

      case "PUT":
        // content-type
        if (req.headers["content-type"] !== "application/json") {
          // Send Response
          return res.status(406).json({
            code: 406,
            message: "Content-type is supported only for application/json",
          });
        }

        // params
        if (!req.body["username"]) {
          return res.status(400).json({
            code: 400,
            message: "Invalid parameters",
          });
        }

        // update user
        const updateUser = await prisma.user.update({
          where: { id: user.id },
          data: { username: String(req.body["username"]) },
        });

        // Send Response
        return res.status(200).json({
          username: updateUser.username,
        });

      default:
        // Send Response
        return res.status(405).json({
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
    return res.status(500).json({
      code: 500,
      message: message,
      hash: hash,
    });
  }
}
