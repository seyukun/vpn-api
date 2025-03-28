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

interface Config {
  public_key: string;
  endpoint: string;
  peers: Array<{
    public_key: string;
    endpoint: string;
    allowed_ips: string[];
    persistent_keepalive: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Status | Config>
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
      case "GET": {
        // Get Peer
        const mypeer = await prisma.peer.findFirst({
          where: { userId: user.id },
        });
        const peers = await prisma.peer.findMany({
          where: {
            userId: { not: user.id },
            updatedAt: {
              gt: new Date(Date.now() - 50 * 1000),
              lt: new Date(Date.now() + 1 * 1000),
            },
          },
        });

        // Send Response
        return res.status(200).json({
          public_key: mypeer?.publicKey ?? "",
          endpoint: mypeer?.endpoint ?? "",
          peers: [
            ...peers.map((peer) => ({
              public_key: peer.publicKey,
              endpoint: peer.endpoint,
              allowed_ips: [`10.0.0.${peer.userId}/32`],
              persistent_keepalive: 20,
            })),
          ],
        });
      }

      case "POST": {
        // content-type
        if (req.headers["content-type"] !== "application/json") {
          // Send Response
          return res.status(406).json({
            code: 406,
            message: "Content-type is supported only for application/json",
          });
        }

        // Validate Parameters
        const regexPublicKey = /^[a-z0-9]{64}$/;
        const regexEndpoint =
          /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}$/;
        if (
          !req.body["public_key"] ||
          !req.body["endpoint"] ||
          !regexPublicKey.test(String(req.body["public_key"])) ||
          !regexEndpoint.test(String(req.body["endpoint"]))
        ) {
          return res.status(400).json({
            code: 400,
            message: "Invalid Parameters",
          });
        }

        // Create Peer
        /* prettier-ignore */
        const octets = [
          ((val) => (val ? val % 255 : val))(Math.floor(user.id / (1 * 255 * 255 * 255))),
          ((val) => (val ? val % 255 : val))(Math.floor(user.id / (1 * 255 * 255))),
          ((val) => (val ? val % 255 : val))(Math.floor(user.id / (1 * 255))),
          ((val) => (val ? val % 255 : val))(Math.floor(user.id / 1)),
        ];
        let mypeer = await prisma.peer.findFirst({
          where: { userId: user.id },
        });
        mypeer =
          mypeer === null
            ? await prisma.peer.create({
                data: {
                  publicKey: String(req.body["public_key"]),
                  endpoint: String(req.body["endpoint"]),
                  allowedIps: `${10 + octets[0]}.${octets[1]}.${octets[2]}.${
                    octets[3]
                  }/32`,
                  persistentKeepaliveInterval: 25,
                  updatedAt: new Date(),
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
              })
            : await prisma.peer.update({
                where: {
                  id: mypeer.id,
                },
                data: {
                  publicKey: String(req.body["public_key"]),
                  endpoint: String(req.body["endpoint"]),
                  allowedIps: `${10 + octets[0]}.${octets[1]}.${octets[2]}.${
                    octets[3]
                  }/32`,
                  persistentKeepaliveInterval: 25,
                  updatedAt: new Date(),
                },
              });

        // Get Peers
        const peers = await prisma.peer.findMany({
          where: {
            userId: { not: user.id },
            updatedAt: {
              gt: new Date(Date.now() - 39 * 1000),
              lt: new Date(Date.now() + 1 * 1000),
            },
          },
        });

        // Send Response
        return res.status(200).json({
          public_key: mypeer?.publicKey ?? "",
          endpoint: mypeer?.endpoint ?? "",
          peers: [
            ...peers.map((peer) => {
              return {
                public_key: peer.publicKey,
                endpoint: peer.endpoint,
                allowed_ips: [peer.allowedIps],
                persistent_keepalive: 20,
              };
            }),
          ],
        });
      }

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
