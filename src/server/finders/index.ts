import { Prisma, PrismaClient } from "@prisma/client";

// 先頭に$がついているものを除外するとmodel名になりそう
type ExcludeDollar<T> = T extends `$${infer _U}` ? never : T;
type Models = ExcludeDollar<keyof PrismaClient>;

type Args<
  M extends Models,
  Extra extends Record<string, unknown>,
  Operation extends "findFirst" | "findMany"
> = Omit<
  Prisma.Args<PrismaClient[M], Operation>,
  "select" | "include" | "distinct"
> &
  Extra;

/**
 * @example
 * const db = new PrismaClient();
 * type Args = FindFirstArgs<typeof db.user>;
 */
export type FindFirstArgs<
  M extends Models,
  Extra extends Record<string, unknown> = {}
> = Args<M, Extra, "findFirst">;

/**
 * @example
 * const db = new PrismaClient();
 * type Args = FindManyArgs<typeof db.user>;
 */
export type FindManyArgs<
  M extends Models,
  Extra extends Record<string, unknown> = {}
> = Args<M, Extra, "findMany">;
