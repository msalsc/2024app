import { createLogger } from "@event-app/logger";
import { initTRPC } from "@trpc/server";
import { Context } from "./context";

export const logger = createLogger({
  name: "trpc-server",
  level: "debug",
  logtail_token: process.env.LOGTAIL_TOKEN,
});

export const t = initTRPC.context<Context>().create();

export const loggerMiddleware = t.middleware(
  async ({ path, type, input, next, ctx }) => {
    const result = await next();

    const timespent: number =
      new Date().valueOf() - new Date(ctx.requestInfo.startedAt).valueOf();

    result.ok
      ? logger.info(
          { path, type, input, responseTime: timespent },
          `Executed query successfully after ${timespent}ms`
        )
      : logger.error(
          { path, type, input, responseTime: timespent },
          `Failed to execute query after ${timespent}ms`
        );
    return result;
  }
);
