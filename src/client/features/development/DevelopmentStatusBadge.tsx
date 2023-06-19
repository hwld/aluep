import { Badge, MantineSize, MantineTheme } from "@mantine/core";
import { DevelopmentStatus } from "../../../server/models/developmentStatus";
import { DevelopmentStatusIds } from "../../../share/consts";

type Props = { status: DevelopmentStatus; size?: MantineSize };

type BadgeColor = {
  background: string;
  border: string;
  text: string;
};

const getColor = (statusId: string, theme: MantineTheme): BadgeColor => {
  switch (statusId) {
    case DevelopmentStatusIds.IN_PROGRESS: {
      const color = theme.colors.blue;
      return {
        background: color[1],
        border: color[5],
        text: color[8],
      };
    }
    case DevelopmentStatusIds.ABORTED: {
      const color = theme.colors.red;
      return {
        background: color[1],
        border: color[4],
        text: color[5],
      };
    }
    case DevelopmentStatusIds.COMPLETED: {
      const color = theme.colors.green;
      return {
        background: color[1],
        border: color[5],
        text: color[8],
      };
    }
    default: {
      throw new Error(`${statusId} is not DevelopmentStatusId`);
    }
  }
};

export const DevelopmentStatusBadge: React.FC<Props> = ({
  status,
  size = "lg",
}) => {
  return (
    <Badge
      radius="sm"
      variant="light"
      size={size}
      sx={{ width: "min-content" }}
      styles={(theme) => ({
        root: {
          backgroundColor: theme.fn.rgba(
            getColor(status.id, theme).background,
            0.3
          ),
          borderWidth: "1px",
          borderColor: getColor(status.id, theme).border,
        },
        inner: {
          marginBottom: size === "xl" ? "3px" : "0",
          color: getColor(status.id, theme).text,
        },
      })}
    >
      {status.name}
    </Badge>
  );
};
