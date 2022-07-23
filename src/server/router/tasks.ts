import { Task, TaskStatus } from "@prisma/client";
import { z } from "zod";

import { createRouter } from "./context";

export const tasksRouter = createRouter() //
  .query("getAll", {
    input: z.object({ boardId: z.string() }),
    async resolve({ input: { boardId }, ctx }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      return await ctx.prisma.task.findMany({ where: { boardId } });
    },
  })

  .query("getByStatus", {
    input: z.object({ boardId: z.string(), status: z.nativeEnum(TaskStatus) }),
    async resolve({ input: { boardId, status }, ctx }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      return await ctx.prisma.task.findMany({ where: { boardId, status } });
    },
  })

  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      boardId: z.string(),
      status: z.nativeEnum(TaskStatus),
    }),
    async resolve({ ctx, input: task }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      return await ctx.prisma.task.create({ data: task });
    },
  })

  .mutation("update", {
    input: z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
    }),
    async resolve({ ctx, input: { id, ...data } }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      return await ctx.prisma.task.update({ where: { id }, data });
    },
  })

  .mutation("remove", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input: { id } }) {
      if (!ctx.session) return ctx.res?.status(401).json({ status: 401 });
      return await ctx.prisma.task.delete({ where: { id } });
    },
  });
