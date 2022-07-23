// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { boardsRouter } from "./boards";
import { tasksRouter } from "./tasks";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("tasks.", tasksRouter)
  .merge("boards.", boardsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
