import { DevStatus, DevStatusNames } from "@/models/developmentStatus";
import { Badge, MantineSize } from "@mantine/core";
import clsx from "clsx";
import classes from "./DevStatusBadge.module.css";

type Props = { status: DevStatus; size?: MantineSize };

export const DevStatusBadge: React.FC<Props> = ({ status, size = "lg" }) => {
  const map: { [T in DevStatus]: string } = {
    IN_PROGRESS: classes["in-progress"],
    COMPLETED: classes.completed,
    ABORTED: classes.aborted,
  };

  return (
    <Badge
      radius="sm"
      variant="light"
      size={size}
      classNames={{
        root: clsx(classes.root, map[status]),
        label: clsx(classes.label, map[status], {
          [classes.xl]: size === "xl",
        }),
      }}
    >
      {DevStatusNames[status]}
    </Badge>
  );
};
