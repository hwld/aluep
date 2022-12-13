import { inferRouterInputs, initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./contexts";
import { prisma } from "./prismadb";
import { AppRouter } from "./routers/_app";

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });

export const router = t.router;
export type RouterInputs = inferRouterInputs<AppRouter>;

// middlewares
const middleware = t.middleware;
export const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const loggedInUser = await prisma.user.findFirst({
    where: { id: ctx.session.user.id },
  });
  if (!loggedInUser) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { session: { user: loggedInUser } } });
});

// procedures
const procedure = t.procedure;
export const publicProcedure = procedure;
export const requireLoggedInProcedure = procedure.use(isLoggedIn);
