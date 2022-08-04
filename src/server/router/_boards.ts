import { TaskStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "./context";

export const boardsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getAll", {
    async resolve({ ctx }) {
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
            return {
              ...board,
              taskCounts: { byStatus: taskCountsByStatus, ALL: totalAmountOfTasks },
            };
          })
        );
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id }, ctx }) {
      return await ctx.prisma.board.findFirst({
        where: { id },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input: { name } }) {
      const userId = ctx.session?.userId;
      const board = { userId, name };
      return await ctx.prisma.board.create({
        data: board,
      });
    },
  })
  .mutation("remove", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      return await ctx.prisma.board.delete({
        where: { id },
      });
    },
  });
