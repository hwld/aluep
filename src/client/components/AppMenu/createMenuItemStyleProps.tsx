import { MenuItemProps } from "@mantine/core";

export const createMenuItemStyleProps: (red?: boolean) => MenuItemProps = (
  red
) => ({
  color: red ? "red.7" : "gray.7",
  sx: (theme) => ({
    "&[data-hovered]": {
      backgroundColor: red ? theme.colors.red[1] : theme.colors.gray[2],
    },
  }),
});
