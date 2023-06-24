import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

type Props = { label: string; url: string; icon: ReactNode };
export const DevelopmentCardIconLink: React.FC<Props> = ({
  label,
  url,
  icon,
}) => {
  return (
    <Tooltip
      label={label}
      position="top"
      withArrow
      transition="pop"
      onClick={stopPropagation}
    >
      <ActionIcon
        size={40}
        component={Link}
        href={url}
        target="_blank"
        sx={(theme) => ({
          transition: "all 200ms",
          "&:hover": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
          },
        })}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};
