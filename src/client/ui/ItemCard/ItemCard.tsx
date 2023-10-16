import { Box, Card, CardProps, Group, Stack } from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  children?: React.ReactNode;
  rightHeader?: React.ReactNode;
  leftHeader?: React.ReactNode;
  rightFooter?: React.ReactNode;
  leftFooter?: React.ReactNode;
} & CardProps &
  ComponentPropsWithoutRef<"div">;

export const ItemCard: React.FC<Props> = ({
  children,
  leftHeader,
  rightHeader,
  leftFooter,
  rightFooter,
  ...cardProps
}) => {
  return (
    <Card p="md" {...cardProps}>
      <Stack gap={5} h="100%" style={{ overflow: "hidden" }}>
        {(leftHeader || rightHeader) && (
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box>{leftHeader}</Box>
            <Box>{rightHeader}</Box>
          </Group>
        )}

        <Box style={{ flexGrow: 1 }}>{children}</Box>

        {(leftFooter || rightFooter) && (
          <Group justify="space-between" align="flex-end" wrap="nowrap" miw={0}>
            <Box style={{ overflow: "hidden" }}>{leftFooter}</Box>
            <Box>{rightFooter}</Box>
          </Group>
        )}
      </Stack>
    </Card>
  );
};
