import {
  NotificationProps,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { SyntheticEvent } from "react";
import { AppRouter } from "../server/routers/_app";

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

export const isTRPCClientError = (
  e: unknown
): e is TRPCClientError<AppRouter> => {
  return e instanceof TRPCClientError;
};

export const showLoadingNotification = (props: NotificationProps) => {
  showNotification({
    color: "blue",
    styles: (theme) => ({ title: { color: theme.colors.blue[7] } }),
    ...props,
  });
};

export const showSuccessNotification = (
  props: NotificationProps,
  opt?: { update: true; id: string }
) => {
  const notification = opt?.update
    ? (others: NotificationProps) =>
        updateNotification({ id: opt.id, ...others })
    : showNotification;

  notification({
    color: "green",
    styles: (theme) => ({ title: { color: theme.colors.green[7] } }),
    ...props,
  });
};

export const showErrorNotification = (
  props: NotificationProps,
  opt?: { update: true; id: string }
) => {
  const notification = opt?.update
    ? (others: NotificationProps) =>
        updateNotification({ id: opt.id, ...others })
    : showNotification;

  notification({
    color: "red",
    styles: (theme) => ({ title: { color: theme.colors.red[7] } }),
    ...props,
  });
};

export const objectKeys = <T extends {}>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy年MM月dd日 H:m", { locale: ja });
};
