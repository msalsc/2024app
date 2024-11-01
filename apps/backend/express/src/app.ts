import cors from "cors";
import express, { Express } from "express";
import http from "http";
import { renderTrpcPanel } from "trpc-panel";
// @ts-ignore
import { Server } from "ws";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter, AppRouter, appRouter as router } from "./trpc/appRouter";
import { createContext } from "./trpc/context";

// http server
const app: Express = express();
const server = http.createServer(app);

// web socket server
const wss = new Server({ server });

const wsHandler = applyWSSHandler<AppRouter>({
  wss,
  router,
  //@ts-ignore
  createContext,
});

app.use(cors());

app.use("/panel", (_, res) => {
  return res.send(
    renderTrpcPanel(appRouter, { url: `${process.env.BACKEND_LINK}trpc` })
  );
});

app.use(
  "/trpc",
  createExpressMiddleware<AppRouter>({
    router,
    createContext,
  })
);

app.get("/healthcheck", (req, res) => {
  res.send(200);
});

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to trpc!" });
});

const port = 4000;
// Comment
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on("error", console.error);

process.on("SIGTERM", () => {
  wsHandler.broadcastReconnectNotification();
  wss.close();
  server.close();
});

export default app;
export * from "./trpc/appRouter";
export type { AppRouter };
