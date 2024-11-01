import { prisma } from "@event-app/database";
import { createFavoriteForUserSchema } from "@event-app/schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return ctx?.session?.user;
  }),
  getAllFavoritesForUser: protectedProcedure.query(async ({ ctx, input }) => {
    const events = await prisma.userEvent.findMany({
      where: {
        user_id: ctx.session.user?.id,
      },
      select: {
        event: true,
      },
    });

    return events.map((i) => i.event);
  }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user?.id) {
      throw new Error("Not logged in");
    }

    await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }),
  createFavoriteForUser: protectedProcedure
    .input(createFavoriteForUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.id) {
        throw new Error("Not logged in");
      }

      const existing = await prisma.userEvent.findFirst({
        where: {
          user_id: ctx.session.user.id,
          event_id: input.eventId,
        },
      });

      if (existing) {
        await prisma.userEvent.delete({
          where: {
            id: existing.id,
          },
        });
        return null;
      } else {
        await prisma.userEvent.create({
          data: {
            user_id: ctx.session.user.id,
            event_id: input.eventId,
          },
        });
      }
    }),
});
