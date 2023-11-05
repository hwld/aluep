import {
  NotificationData,
  showNotification,
  updateNotification,
} from "@mantine/notifications";

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
