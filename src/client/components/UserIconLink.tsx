import { Avatar } from "@mantine/core";
import Link from "next/link";
import { stopPropagation } from "../utils";

type Props = {
  imageSrc?: string | null;
  userId: string;
  size?: "md" | "sm" | "xl";
};

export const UserIconLink: React.FC<Props> = ({
  imageSrc: src,
  userId,
  size = "md",
}) => {
  return (
    <Link href={`/users/${userId}`} onClick={stopPropagation}>
      <Avatar
        src={src}
        size={size}
        sx={(theme) => ({
          borderWidth: "2px",
          borderColor: theme.colors.gray[2],
          borderStyle: "solid",
          borderRadius: "100%",
          transition: "all 150ms",
          "&:hover": {
            borderColor: theme.colors.red[8],
          },
        })}
      />
    </Link>
  );
};
