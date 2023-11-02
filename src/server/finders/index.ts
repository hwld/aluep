import { Prisma } from "@prisma/client";

type Args<
  M,
  Extra extends Record<string, unknown>,
  Operation extends "findFirst" | "findMany"
> = Omit<Prisma.Args<M, Operation>, "select" | "include"> & Extra;

/**
 * @example
 * const db = new PrismaClient();
 * type Args = FindFirstArgs<typeof db.user>;
 */
export type FindFirstArgs<M, Extra extends Record<string, unknown> = {}> = Args<
  M,
  Extra,
  "findFirst"
>;

/**
 * @example
 * const db = new PrismaClient();
 * type Args = FindManyArgs<typeof db.user>;
 */
export type FindManyArgs<M, Extra extends Record<string, unknown> = {}> = Args<
  M,
  Extra,
  "findMany"
>;
