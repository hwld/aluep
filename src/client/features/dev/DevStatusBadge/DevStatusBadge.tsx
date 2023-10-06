import { DevStatusIds } from "@/share/consts";
import { Badge, MantineSize } from "@mantine/core";
import { DevelopmentStatus } from "@prisma/client";
import clsx from "clsx";
import classes from "./DevStatusBadge.module.css";

type Props = { status: DevelopmentStatus; size?: MantineSize };

export const DevStatusBadge: React.FC<Props> = ({ status, size = "lg" }) => {
  const map = {
    [DevStatusIds.IN_PROGRESS]: classes["in-progress"],
    [DevStatusIds.COMPLETED]: classes.completed,
    [DevStatusIds.ABORTED]: classes.aborted,
  };

  return (
    <Badge
      radius="sm"
      variant="light"
      size={size}
      classNames={{
        root: clsx(classes.root, map[status.id]),
        label: clsx(classes.label, map[status.id], {
          [classes.xl]: size === "xl",
        }),
      }}
    >
      {status.name}
    </Badge>
  );
};
