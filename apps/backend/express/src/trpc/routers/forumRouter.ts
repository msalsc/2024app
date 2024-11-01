import { ForumCategoryType, prisma } from "@event-app/database";
import {
  createNewMessageForCategorySchema,
  getMessagesForCategorySchema,
} from "@event-app/schema";
import { z } from "zod";
const AWS = require("aws-sdk");

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const forumRouter = router({
  getForumCategories: protectedProcedure.query(async (req) => {

    const userGender: "male" | "female" = req.ctx.session.user.gender as "male" | "female";

    const userGenderToForumType = {
      "male": "male_only",
      "female": "female_only"
    }

    const forumCategoryType: ForumCategoryType = userGenderToForumType[userGender] as ForumCategoryType;

    let forumCategory = await prisma.forumCategory.findMany({
      where: {
        deleted_at: null,
        OR: [
          {
            type: "all"
          },
          {
            type: forumCategoryType
          }
        ]
      }
    });

    if (req.ctx.session.user.is_admin) {
      forumCategory = await prisma.forumCategory.findMany({
        where: {
          deleted_at: null
        }
      });
    }



    let returnResults = [];

    for (let forumIndex = 0; forumIndex < forumCategory.length; forumIndex++) {
      const element = forumCategory[forumIndex];
      const totalMessages = await prisma.forumMessage.aggregate({
        where: {
          forum_category_id: element.id,
          deleted_at: null,
        },
        _count: {
          id: true,
        },
      });

      const firstMessageForCategory = await prisma.forumMessage.findFirst({
        where: {
          forum_category_id: element.id,
          deleted_at: null,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      returnResults.push({
        message: firstMessageForCategory,
        count: totalMessages._count.id,
        category: element,
      });
    }

    return returnResults;
  }),
  getMessagesForCategories: publicProcedure
    .meta({ description: "Get messages for a category. Cursor Based." })
    .input(getMessagesForCategorySchema)
    .query(async (req) => {





      const messages = await prisma.forumMessage.findMany({
        where: {
          deleted_at: null,
          forum_category_id: req.input.category,
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          message: true,
          created_at: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        take: 25,
        skip: req.input.cursor ? 1 : 0,
        cursor: req.input.cursor ? { id: req.input.cursor } : undefined,
      });

      const total = await prisma.forumMessage.count({
        where: {
          deleted_at: null,
          forum_category_id: req.input.category,
        },
      });

      return {
        messages,
        total: total,
        cursor: messages.length > 0 ? messages[messages.length - 1].id : null,
      };
    }),

  createNewMessageForPrivateCategory: publicProcedure
    .input(
      z.object({
        message: z.string(),
        category: z.string(),
        should_send_notification: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.forumMessage.create({
        data: {
          message: input.message,
          forum_category_id: input.category,
          user_id: "clen3fgid0002cd642yxuccze",
        },
      });

      if (input.should_send_notification) {
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
                    alert: input.message,
                  },
                }),
                GCM: JSON.stringify({
                  data: {
                    message: input.message,
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
    }),
  createNewMessageForCategory: publicProcedure
    .input(createNewMessageForCategorySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) throw new Error("Not logged in");

      return prisma.forumMessage.create({
        data: {
          message: input.message,
          forum_category_id: input.category,
          user_id: ctx.session.user.id,
        },
      });
    }),
});
