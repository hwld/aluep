import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import classes from "./DevCardLinkIcon.module.css";

type Props = { label: string; url: string; icon: ReactNode };
export const DevCardIconLink: React.FC<Props> = ({ label, url, icon }) => {
  return (
    <Tooltip
      label={label}
      position="top"
      withArrow
      transitionProps={{ transition: "pop" }}
      onClick={stopPropagation}
    >
      <ActionIcon
        size={40}
        component={Link}
        href={url}
        target="_blank"
        className={classes.icon}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};
