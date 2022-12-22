import { NotificationProps, showNotification } from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";
import { SyntheticEvent } from "react";
import { AppRouter } from "../server/routers/_app";

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

export const isTRPCClientError = (
  e: unknown
): e is TRPCClientError<AppRouter> => {
  return e instanceof TRPCClientError;
};

export const showSuccessNotification = (props: NotificationProps) => {
  showNotification({
    color: "green",
    styles: (theme) => ({ title: { color: theme.colors.green[7] } }),
    ...props,
  });
};

export const showErrorNotification = (props: NotificationProps) => {
  showNotification({
    color: "red",
    styles: (theme) => ({ title: { color: theme.colors.red[7] } }),
    ...props,
  });
};
