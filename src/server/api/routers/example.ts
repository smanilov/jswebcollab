import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const registeredUsers: string[] = [
  'clfzcmbw30000u02hafk5hq0b'
];

function isRegisteredUser(userId: string) {
  return registeredUsers.indexOf(userId) != -1;
}

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  isRegisteredUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return isRegisteredUser(input.id);
    }),
});
