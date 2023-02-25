import { Textarea, TextareaProps } from "@mantine/core";
import { forwardRef } from "react";

type Props = TextareaProps;
export const AppTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    return (
      <Textarea
        ref={ref}
        styles={(theme) => ({
          input: {
            backgroundColor: theme.colors.gray[0],
            color: theme.colors.gray[7],
          },
          label: { color: theme.colors.gray[5] },
        })}
        {...props}
      />
    );
  }
);
AppTextarea.displayName = "AppTextarea";
