import {
  NotificationData,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { SyntheticEvent } from "react";

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

export const showLoadingNotification = (props: NotificationData) => {
  showNotification({
    color: "blue",
    styles: (idea) => ({ title: { color: idea.colors.blue[7] } }),
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
    ...props,
  });
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy年MM月dd日", { locale: ja });
};
