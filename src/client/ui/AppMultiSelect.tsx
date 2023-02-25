import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { forwardRef } from "react";

type Props = MultiSelectProps;
export const AppMultiSelect = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return (
      <MultiSelect
        ref={ref}
        styles={(theme) => ({
          input: { backgroundColor: theme.colors.gray[0] },
          label: { color: theme.colors.gray[5] },
          item: {
            color: theme.colors.gray[7],
            "&[aria-selected='true']": {
              backgroundColor: theme.colors.gray[2],
            },
          },
          defaultValue: {
            backgroundColor: theme.colors.gray[2],
            color: theme.colors.gray[7],
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
  }
);
AppMultiSelect.displayName = "AppMultiSelect";
