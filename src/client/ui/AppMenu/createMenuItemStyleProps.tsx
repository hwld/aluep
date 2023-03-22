import { MenuItemProps } from "@mantine/core";

export const createMenuItemStyleProps: (red?: boolean) => MenuItemProps = (
  red
) => ({
  color: red ? "red.7" : "gray.7",
  sx: (idea) => ({
    padding: "5px 8px",
    "&[data-hovered]": {
      backgroundColor: red ? idea.colors.red[1] : idea.colors.gray[2],
    },
  }),
});
