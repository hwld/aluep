import { Tooltip, TooltipProps } from "@mantine/core";

type Props = TooltipProps & { hidden?: boolean };
export const AppTooltip: React.FC<Props> = ({
  hidden = false,
  children,
  ...props
}) => {
  if (hidden) {
    return <>{children}</>;
  } else {
    return <Tooltip {...props}>{children}</Tooltip>;
  }
};
