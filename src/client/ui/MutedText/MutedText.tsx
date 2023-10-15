import { Text, TextProps } from "@mantine/core";

type Props = TextProps & { children: React.ReactNode };

// TODO
export const MutedText: React.FC<Props> = ({ children, ...textProps }) => {
  return (
    <Text size="sm" c="gray.5" {...textProps}>
      {children}
    </Text>
  );
};
