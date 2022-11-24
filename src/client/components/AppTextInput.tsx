import { TextInput, TextInputProps } from "@mantine/core";

type Props = TextInputProps;
export const AppTextInput: React.FC<Props> = ({ ...props }) => {
  return (
    <TextInput
      styles={(theme) => ({
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
};
