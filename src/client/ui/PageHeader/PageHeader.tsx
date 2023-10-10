import { Flex, Title } from "@mantine/core";
import { IconType } from "react-icons/lib";

type Props = { icon: IconType; pageName: string };
export const PageHeader: React.FC<Props> = ({ icon: Icon, pageName }) => {
  return (
    <Flex mb="lg" gap={5}>
      <Icon size={25} color="var(--mantine-color-gray-7)" />
      <Title order={1} c="gray.7" size="md">
        {pageName}
      </Title>
    </Flex>
  );
};
