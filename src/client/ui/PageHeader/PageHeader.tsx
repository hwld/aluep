import { Flex, Title } from "@mantine/core";
import { SVGProps } from "react";

type Props = { icon: React.FC<SVGProps<SVGSVGElement>>; pageName: string };
export const PageHeader: React.FC<Props> = ({ icon: Icon, pageName }) => {
  return (
    <Flex mb="lg" gap={5}>
      <Icon width={25} height={25} color="var(--mantine-color-gray-7)" />
      <Title order={1} c="gray.7" size="md">
        {pageName}
      </Title>
    </Flex>
  );
};
