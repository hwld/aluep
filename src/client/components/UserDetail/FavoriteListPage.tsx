import { Box } from "@mantine/core";
import { User } from "@prisma/client";

import React from "react";
import { useFavoriteListQuery } from "../../hooks/useFavoriteListQuery";
import { useSessionQuery } from "../../hooks/useSessionQuery";
import { UserCard, userCardMinWidthPx } from "../UserCard";

type Props = { user?: User[] };

export const FavoriteListPage: React.FC<Props> = ({ user }) => {
  //ここ直す
  const { session } = useSessionQuery();

  const { favoriteList } = useFavoriteListQuery(session.user.id);
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
        gap: theme.spacing.md,
      })}
    >
      {favoriteList.map((user) => {
        return <UserCard key={user.id} user={user} />;
      })}
    </Box>
  );
};
