import superjson from "superjson";

import { authRouter } from "./_auth";
import { boardsRouter } from "./_boards";
import { tasksRouter } from "./_tasks";
import { createRouter } from "./context";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("tasks.", tasksRouter)
  .merge("boards.", boardsRouter);

export type AppRouter = typeof appRouter;
