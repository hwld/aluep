import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { findUser } from "@/server/finders/user";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { IncomingMessage } from "http";
import { getServerSession, Session } from "next-auth";
import SuperJSON from "superjson";

export async function createTRPCContext(
  opts: CreateNextContextOptions
): Promise<{
  session: Session | null;
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  };
}> {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  return { session, req: opts.req };
}

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<TRPCContext>().create({ transformer: SuperJSON });

export const router = t.router;

// middlewares
const middleware = t.middleware;
const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const loggedInUser = await findUser({ where: { id: ctx.session.user.id } });
  if (!loggedInUser) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { session: { user: loggedInUser } } });
});

// procedures
const procedure = t.procedure;
export const publicProcedure = procedure;
export const requireLoggedInProcedure = procedure.use(isLoggedIn);
