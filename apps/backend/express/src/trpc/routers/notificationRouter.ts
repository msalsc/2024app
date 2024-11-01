import { prisma } from "@event-app/database";
import { addNotifcationInput, sendUserUpdateSchema } from "@event-app/schema";
import { logger } from "../loggerMiddleware";
import { protectedProcedure, publicProcedure, router } from "../trpc";
const AWS = require("aws-sdk");

export const notificationRouter = router({
  addNotificationToken: protectedProcedure
    .input(addNotifcationInput)
    .mutation(async (req) => {
      const { platform, token } = req.input;

      const sns = new AWS.SNS({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const applicationArn =
        platform === "ios" ? process.env.IOS_ARN : process.env.ANDROID_ARN;

      const endpointArn = await sns
        .createPlatformEndpoint({
          PlatformApplicationArn: applicationArn,
          Token: token,
        })
        .promise()
        .then((data: { EndpointArn: String }) => {
          return data.EndpointArn;
        })
        .catch((error: any) => {
          logger.error("Error saving new token", error);
        });

      await prisma.notificationToken.create({
        data: {
          token: endpointArn,
          user_id: req?.ctx?.session?.user?.id,
        },
      });
    }),
  getAllUpdates: protectedProcedure.query(async (req) => {
    return prisma.update.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }),
  createNewUpdate: publicProcedure
    .input(sendUserUpdateSchema)
    .mutation(async (req) => {
      try {
        // Create the update
        const update = await prisma.update.create({
          data: {
            description: req.input.description,
            event_id: req.input.event_id ? req.input.event_id : undefined,
            name: req.input.name,
          },
        });

        if (req.input.shouldSendNotication) {
          const tokens = await prisma.notificationToken.findMany({
            where: {
              deleted_at: null,
            },
          });

          for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
            const element = tokens[tokenIndex];

            const sns = new AWS.SNS({
              region: process.env.AWS_REGION,
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });

            let applicationArn = "";
            const userToken = element.token;
            if (userToken.includes("APNS")) {
              applicationArn = process.env.IOS_ARN;
            } else {
              applicationArn = process.env.ANDROID_ARN;
            }

            sns
              .publish({
                TargetArn: userToken,
                MessageStructure: "json", // so we can put in a custom payload and message
                Message: JSON.stringify({
                  APNS: JSON.stringify({
                    aps: {
                      alert: req.input.description,
                    },
                  }),
                  GCM: JSON.stringify({
                    data: {
                      message: req.input.description,
                    },
                  }),
                }),
              })
              .promise()
              .then(async (info) => {
                console.info("Notification sent!", info);
              })
              .catch(async (err) => {
                await prisma.notificationToken.update({
                  data: {
                    deleted_at: new Date(),
                  },
                  where: {
                    token: userToken,
                  },
                });
              });
          }
        }

        return {
          success: true,
        };
      } catch (err) {
        console.log("error", err);
      }
    }),
});
