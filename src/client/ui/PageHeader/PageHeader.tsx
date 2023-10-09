import { Flex, Title } from "@mantine/core";
import { IconType } from "react-icons/lib";
import classes from "./PageHeader.module.css";

type Props = { icon: IconType; pageName: string };
export const PageHeader: React.FC<Props> = ({ icon: Icon, pageName }) => {
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
      className={classes.root}
    >
      <Icon size={25} color="var(--mantine-color-gray-1)" />
      <Title order={1} c="gray.1" size="md">
        {pageName}
      </Title>
    </Flex>
  );
};
