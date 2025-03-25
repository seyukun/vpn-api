import { PrismaClient } from "@prisma/client";

export async function findUserByAuthorization(
  prisma: PrismaClient,
  authorization: string | undefined
) {
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
