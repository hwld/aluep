import { Badge, DefaultMantineColor, MantineSize } from "@mantine/core";
import { useMemo } from "react";
import { DevelopmentStatus } from "../../../../server/models/developmentStatus";
import { DevelopmentStatusIds } from "../../../../share/consts";

type Props = { status: DevelopmentStatus; size?: MantineSize };
export const DevelopmentStatusBadge: React.FC<Props> = ({
  status,
  size = "lg",
}) => {
  const color = useMemo((): DefaultMantineColor => {
    switch (status.id) {
      case DevelopmentStatusIds.IN_PROGRESS:
        return "blue";
      case DevelopmentStatusIds.ABORTED:
        return "red";
      case DevelopmentStatusIds.COMPLETED:
        return "green";
      default:
        throw new Error(`${status.id} is not DevelopmentStatusId`);
    }
  }, [status.id]);

  return (
    <Badge
      radius="sm"
      variant="light"
      size={size}
      sx={{ width: "min-content" }}
      styles={(theme) => ({
        root: {
          backgroundColor: theme.fn.rgba(theme.colors[color][1], 0.3),
          borderWidth: "1px",
          borderColor: theme.colors[color][5],
        },
        inner: {
          marginBottom: size === "xl" ? "3px" : "0",
          color: theme.colors[color][8],
        },
      })}
    >
      {status.name}
    </Badge>
  );
};
