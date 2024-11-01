import { prisma, User } from "@event-app/database";
import * as trpc from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import cuid from "cuid";

//eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(
  _opts: CreateContextOptions & CreateExpressContextOptions
) {
  const req = _opts.req;
  const res = _opts.res;

  const requestInfo = {
    id: cuid(),
    startedAt: new Date(),
  };

  try {
    const parseCookie = (str) =>
      str
        .split(";")
        .map((v) => v.split("="))
        .reduce((acc, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
            v[1].trim()
          );
          return acc;
        }, {});

    let token = req.headers.authorization;
    const cookie = req.headers.cookie;
    const parsed = cookie ? parseCookie(cookie) : null;

    if (parsed?.jwt) {
      token = parsed?.jwt;
    }

    var jwt = require("jsonwebtoken");
    const secret = process.env.JWT_SECRET;
    let userId = null;

    if (token) {
      const tokenResult: any = jwt.verify(token, secret);
      userId = tokenResult?.identity?.id;
    }

    let user: User | null = null;

    if (userId) {
      user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
    }

    let session = {
      user,
    };

    return {
      requestInfo,
      req,
      res,
      session,
    };
  } catch (err) {
    return {
      requestInfo,
      req,
      res,
      session: {
        user: null,
      },
    };
  }
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching

  return await createContextInner(opts);
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;
