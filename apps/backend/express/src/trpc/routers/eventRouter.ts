import { prisma } from "@event-app/database";
import { getEventById } from "@event-app/schema";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const eventRouter = router({
  getEvents: protectedProcedure
    .input(
      z.object({
        eventType: z
          .enum(["all", "brothers", "sisters", "competitors"])
          .optional()
          .nullish(),
      })
    )
    .query(async (req) => {
      try {
        const events = await prisma.event.findMany({
          where: {
            deleted_at: null,
            type_of_event: req.input.eventType
              ? req.input.eventType
              : undefined,
          },
          include: {
            location: true,
          },
          orderBy: {
            start_date: "asc",
          },
        });

        return events;
      } catch (error) {
        console.log("error", error);
      }
    }),
  isEventFavorited: protectedProcedure
    .input(getEventById)
    .query(async (req) => {
      const isEventFavorited = await prisma.userEvent.findFirst({
        where: {
          user_id: req.ctx.session.user?.id,
          event_id: req.input.id,
        },
      });
      return !!isEventFavorited;
    }),
  getEvent: publicProcedure.input(getEventById).query(async (req) => {
    return prisma.event.findUnique({
      where: {
        id: req.input.id,
      },
      include: {
        location: true,
      },
    });
  }),
});
