import { Badge, BadgeProps } from "@mantine/core";
import { OmitStrict } from "../../types/OmitStrict";

type Props = OmitStrict<BadgeProps, "sx">;
export const ThemeTagBadge: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Badge
      {...props}
      sx={(theme) => ({
        textTransform: "none",
        backgroundColor: theme.fn.rgba(theme.colors.red[7], 0.1),
        color: theme.colors.red[7],
      })}
    >
      {children}
    </Badge>
  );
};
