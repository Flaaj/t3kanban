import { createRouter } from "./context";
import { z } from "zod";
import { resolve } from "path";
import { TaskStatus } from "prisma/enums.type";

export const boardsRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      const userId = ctx.session?.userId;
      return await ctx.prisma.board.findMany({
        where: { userId },
        include: { tasks: { select: { status: true } } },
      });
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
