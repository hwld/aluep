import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex, Stack, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";

type Props = { dev: Dev };

export const DevDetailCardTitle: React.FC<Props> = ({ dev }) => {
  return (
    <Flex gap={5}>
      <Stack gap="xs" miw={0}>
        <Text c="red.7" size="xl" fw="bold" truncate>
          {dev.title}
        </Text>
        <Flex gap={5}>
          {dev.idea ? (
            <>
              <IconFileText />
              <TextLink href={Routes.idea(dev.idea.id)}>
                <Text truncate>{dev.idea.title}</Text>
              </TextLink>
            </>
          ) : (
            <>
              <IconFileText color="var(--mantine-color-gray-4)" />
              <Text c="gray.4" truncate>
                削除されたお題
              </Text>
            </>
          )}
        </Flex>
      </Stack>
    </Flex>
  );
};
