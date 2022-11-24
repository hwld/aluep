import { Textarea, TextareaProps } from "@mantine/core";

type Props = TextareaProps;
export const AppTextarea: React.FC<Props> = ({ ...props }) => {
  return (
    <Textarea
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
};
