import { AppRouter } from "@/server/router";
import { httpBatchLink, TRPCClientErrorLike } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import {
  UseTRPCMutationOptions,
  UseTRPCMutationResult,
} from "@trpc/react-query/shared";
import { AnyMutationProcedure, inferProcedureInput } from "@trpc/server";
import { inferTransformedProcedureOutput } from "@trpc/server/shared";
import SuperJSON from "superjson";

function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_URL;
  } else {
    return "http://localhost:3000";
  }
}

export const trpc = createTRPCNext<AppRouter>({
  config: () => {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: SuperJSON,
      queryClientConfig: {
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      },
    };
  },
  ssr: false,
  overrides: {
    useMutation: {
      onSuccess: async (opts) => {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

// @trpc/react-queryの定義をそのまま持ってきてる
export type Mutator<T extends AnyMutationProcedure> = {
  useMutation: <TContext = unknown>(
    opts?: UseTRPCMutationOptions<
      inferProcedureInput<T>,
      TRPCClientErrorLike<T>,
      inferTransformedProcedureOutput<T>,
      TContext
    >
  ) => UseTRPCMutationResult<
    inferTransformedProcedureOutput<T>,
    TRPCClientErrorLike<T>,
    inferProcedureInput<T>,
    TContext
  >;
};

export type MutationOpt<T extends AnyMutationProcedure> = Parameters<
  Mutator<T>["useMutation"]
>[0];
