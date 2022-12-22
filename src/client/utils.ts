import { TRPCClientError } from "@trpc/client";
import { SyntheticEvent } from "react";
import { AppRouter } from "../server/routers/_app";

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

export const isTRPCClientError = (
  e: unknown
): e is TRPCClientError<AppRouter> => {
  return e instanceof TRPCClientError;
};
