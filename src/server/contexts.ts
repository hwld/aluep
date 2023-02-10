import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { IncomingMessage } from "http";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<{
  session: Session | null;
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  };
}> {
  const session = await unstable_getServerSession(
    opts.req,
    opts.res,
    authOptions
  );

  return { session, req: opts.req };
}

export type Context = inferAsyncReturnType<typeof createContext>;
