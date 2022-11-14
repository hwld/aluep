import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./contexts";
import { prisma } from "./prismadb";

const t = initTRPC.context<Context>().create();

export const router = t.router;
const procedure = t.procedure;
const middleware = t.middleware;

// middlewares
export const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const user = await prisma.user.findFirst({
    where: { id: ctx.session.user.id },
  });
  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { user, userId: ctx.session.user.id } });
});

// procedures
export const publicProcedure = procedure;
export const requireLoggedInProcedure = procedure.use(isLoggedIn);
