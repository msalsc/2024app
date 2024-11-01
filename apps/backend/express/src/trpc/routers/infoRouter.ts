import { prisma } from "@event-app/database";
import { protectedProcedure, router } from "../trpc";

export const infoRouter = router({
  getHomeScreenInfo: protectedProcedure.query(async (req) => {
    return prisma.variableContent.findUnique({
      where: {
        key: "ABOUT_MSA",
      },
    });
  }),
  getFullInfo: protectedProcedure.query(async (req) => {
    return prisma.variableContent.findUnique({
      where: {
        key: "ABOUT_MSA_MORE",
      },
    });
  }),
  getSponsorInfo: protectedProcedure.query(async (req) => {
    return prisma.sponsors.findMany({
      orderBy: {
        order: "asc",
      },
    });
  }),
});
