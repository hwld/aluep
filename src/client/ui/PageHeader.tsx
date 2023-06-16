import { Flex, Title, useMantineTheme } from "@mantine/core";
import { IconType } from "react-icons";

type Props = { icon: IconType; pageName: string };
export const PageHeader: React.FC<Props> = ({ icon: Icon, pageName }) => {
  const { colors } = useMantineTheme();

  return (
    <Flex
      w={400}
      h={40}
      bg="red.7"
      mb="lg"
      justify="flex-start"
      align="center"
      py="xs"
      px="xl"
      gap={5}
      sx={(theme) => ({
        borderRadius: "20px",
        boxShadow: `0px 4px 6px ${theme.fn.rgba(theme.colors.red[7], 0.3)}`,
      })}
    >
      <Icon size={25} color={colors.gray[1]} />
      <Title order={1} c="gray.1" fw="bold" size="md">
        {pageName}
      </Title>
    </Flex>
  );
};
