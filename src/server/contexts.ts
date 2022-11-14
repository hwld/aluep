import { authOptions } from "../pages/api/auth/[...nextauth]";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = await unstable_getServerSession(
    opts.req,
    opts.res,
    authOptions
  );

  return { session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
