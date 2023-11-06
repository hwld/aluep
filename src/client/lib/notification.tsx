import { MutationOpt, Mutator } from "@/client/lib/trpc";
import {
  NotificationData,
  showNotification,
  updateNotification,
} from "@mantine/notifications";

import { AnyMutationProcedure } from "@trpc/server";

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
  opts?: MutationOpt<T> & {
    succsesNotification?: NotificationData;
    errorNotification?: NotificationData;
  }
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
