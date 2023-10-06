import { stopPropagation } from "@/client/lib/utils";
import { Routes } from "@/share/routes";
import { Badge, BadgeProps } from "@mantine/core";
import Link from "next/link";
import classes from "./IdeaTagBadge.module.css";

type Props = { tagId: string } & BadgeProps;
export const IdeaTagBadge: React.FC<Props> = ({
  tagId,
  children,
  ...props
}) => {
  return (
    <Badge
      // スタイルを当てるために使用している
      aria-label="tag-badge"
      component={Link}
      href={Routes.ideaSearch({ tagIds: tagId })}
      {...props}
      className={classes.root}
      onClick={stopPropagation}
    >
      {children}
    </Badge>
  );
};
