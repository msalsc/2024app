// Thanks https://twitter.com/mattpocockuk/status/1615110808219918352?s=61&t=9ABab3tAzREwUdNM6rasDw

import { z } from "zod";

const envVariables = z.object({
  TOKEN_EXPIRES_IN: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  IOS_ARN: z.string(),
  ANDROID_ARN: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
