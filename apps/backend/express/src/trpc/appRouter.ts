import { authRouter } from "./routers/authRouter";
import { eventRouter } from "./routers/eventRouter";
import { forumRouter } from "./routers/forumRouter";
import { infoRouter } from "./routers/infoRouter";
import { notificationRouter } from "./routers/notificationRouter";
import { userRouter } from "./routers/userRouter";
import { router } from "./trpc";

const appRouter = router({
  userRouter,
  eventRouter,
  notificationRouter,
  forumRouter,
  infoRouter,
  authRouter,
});

export { appRouter };

export type AppRouter = typeof appRouter;
