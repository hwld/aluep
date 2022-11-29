import { TextInput, TextInputProps } from "@mantine/core";
import { forwardRef } from "react";

type Props = TextInputProps;
export const AppTextInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return (
      <TextInput
        ref={ref}
        styles={(theme, params) => ({
          input: {
            backgroundColor: theme.colors.gray[0],
            color: theme.colors.gray[7],
          },
          label: { color: theme.colors.gray[5] },
        })}
        autoComplete="off"
        {...props}
      />
    );
  }
);
