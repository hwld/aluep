import { MenuItemProps } from "@mantine/core";

export const createMenuItemStyleProps: (red?: boolean) => MenuItemProps = (
  red
) => ({
  color: red ? "red.7" : "#676767",
  sx: (theme) => ({
    borderRadius: theme.radius.sm,
    padding: "5px 12px",
    "&[data-hovered]": {
      backgroundColor: red ? theme.colors.red[1] : theme.colors.gray[2],
      color: red ? theme.colors.red[8] : theme.colors.gray[8],
    },
  }),
});
