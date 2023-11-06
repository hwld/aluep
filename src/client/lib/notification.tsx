import {
  NotificationData,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { TRPCClientErrorLike } from "@trpc/client";
import {
  UseTRPCMutationOptions,
  UseTRPCMutationResult,
} from "@trpc/react-query/shared";
import { AnyMutationProcedure, inferProcedureInput } from "@trpc/server";
import { inferTransformedProcedureOutput } from "@trpc/server/shared";

export const showLoadingNotification = (props: NotificationData) => {
  showNotification({
    color: "blue",
    styles: (idea) => ({ title: { color: idea.colors.blue[7] } }),
    withCloseButton: true,
    ...props,
  });
};

export const showSuccessNotification = (
  props: NotificationData,
  opt?: { update: true; id: string }
) => {
  const notification = opt?.update
    ? (others: NotificationData) =>
        updateNotification({ id: opt.id, ...others })
    : showNotification;

  notification({
    color: "green",
    styles: (idea) => ({ title: { color: idea.colors.green[7] } }),
    withCloseButton: true,
    ...props,
  });
};

export const showErrorNotification = (
  props: NotificationData,
  opt?: { update: true; id: string }
) => {
  const notification = opt?.update
    ? (others: NotificationData) =>
        updateNotification({ id: opt.id, ...others })
    : showNotification;

  notification({
    color: "red",
    styles: (idea) => ({ title: { color: idea.colors.red[7] } }),
    withCloseButton: true,
    ...props,
  });
};

/**
 * 成功、失敗時に通知を出してくれるMutation
 */
export const useMutationWithNotification = <T extends AnyMutationProcedure>(
  mutator: Mutator<T>,
  opts?: MutationOpt<T>
) => {
  return mutator.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      if (opts?.succsesNotification) {
        showSuccessNotification({ ...opts.succsesNotification });
      }

      if (opts?.onSuccess) {
        await opts.onSuccess(...args);
      }
    },
    onError: async (...args) => {
      if (opts?.errorNotification) {
        showErrorNotification({ ...opts.errorNotification });
      }

      if (opts?.onError) {
        await opts.onError(...args);
      }
    },
  });
};

// @trpc/react-queryの定義をそのまま持ってきてる
type Mutator<T extends AnyMutationProcedure> = {
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

type MutationOpt<T extends AnyMutationProcedure> = Parameters<
  Mutator<T>["useMutation"]
>[0] & {
  succsesNotification?: NotificationData;
  errorNotification?: NotificationData;
};
