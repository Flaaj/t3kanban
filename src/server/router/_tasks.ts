import { Task, TaskStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "./context";

export const tasksRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getAll", {
    input: z.object({
      boardId: z.string(),
    }),
    async resolve({ input: { boardId }, ctx }) {
      return await ctx.prisma.task.findMany({
        where: { boardId },
      });
    },
  })
  .query("getByStatus", {
    input: z.object({
      boardId: z.string(),
      status: z.nativeEnum(TaskStatus),
    }),
    async resolve({ input: { boardId, status }, ctx }) {
      return await ctx.prisma.task.findMany({
        where: { boardId, status },
      });
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
      return await ctx.prisma.task.create({
        data: task,
      });
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
      return await ctx.prisma.task.update({
        where: { id },
        data,
      });
    },
  })
  .mutation("remove", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      return await ctx.prisma.task.delete({
        where: { id },
      });
    },
  });
