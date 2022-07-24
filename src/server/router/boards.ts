import { TaskStatus } from "@prisma/client";
import { z } from "zod";

import { createRouter } from "./context";

export const boardsRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      console.log(ctx);
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      const userId = ctx.session?.userId;
      return await ctx.prisma.board
        .findMany({
          where: { userId },
          include: { tasks: { select: { status: true } } },
        })
        .then((boards) =>
          boards.map((board) => {
            let totalAmountOfTasks = 0;
            const taskCountsByStatus: { [key in TaskStatus]: number } = {
              BACKLOG: 0,
              TODO: 0,
              IN_PROGRESS: 0,
              ICE_BOXED: 0,
              TESTING: 0,
              DONE: 0,
            };
            board.tasks.forEach((task) => {
              taskCountsByStatus[task.status]++;
              totalAmountOfTasks++;
            });
            return { ...board, tasks: { status: taskCountsByStatus, total: totalAmountOfTasks } };
          })
        );
    },
  })

  .mutation("create", {
    input: z.object({ name: z.string() }),
    async resolve({ ctx, input: { name } }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      const userId = ctx.session?.userId;
      const board = { userId, name };
      return await ctx.prisma.board.create({ data: board });
    },
  })

  .mutation("remove", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input: { id } }) {
      return await ctx.prisma.board.delete({ where: { id } });
    },
  });
