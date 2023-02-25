import { Select, SelectProps } from "@mantine/core";
import { forwardRef } from "react";

type Props = SelectProps;
export const AppSelect = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <Select
      ref={ref}
      styles={(theme) => ({
        input: {
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.gray[7],
        },
        label: { color: theme.colors.gray[5] },
        item: {
          color: theme.colors.gray[7],
          "&:hover": {
            backgroundColor: theme.colors.gray[2],
          },
        },
        dropdown: {
          backgroundColor: theme.colors.gray[0],
          border: "1px solid",
          borderColor: theme.colors.red[7],
        },
      })}
      {...props}
    />
  );
});
AppSelect.displayName = "AppSelect";
