import { Box, Button, Card, Flex, Text } from "@mantine/core";
import { User } from "@prisma/client";
import router from "next/router";
import React from "react";
import { useSumThemeLikesQuery } from "../../hooks/useSumThemeLikesQuery";
import { useThemeDeveloperLikesQuery } from "../../hooks/useThemeDeveloperLikesQuery";
import { UserDetailCard } from "../UserDetailCard";
import { UserDetailTab } from "./UserDetailTab";

export type UserDetailProps = {
  user: User;
  type: "post" | "join" | "like";
};

export const UserDetail: React.FC<UserDetailProps> = ({ user, type }) => {
  const { sumThemeLikes } = useSumThemeLikesQuery(user.id);

  const { themeDeveloperLikes } = useThemeDeveloperLikesQuery(user.id);

  let githubUrl: string = "https://github.com/";
  githubUrl += user.name;

  const handleSwitchPost = () => {
    router.push(`/users/${user.id}/posted-themes`);
  };
  const handleSwitchJoin = () => {
    router.push(`/users/${user.id}/joined-themes`);
  };
  const handleSwitchLike = () => {
    router.push(`/users/${user.id}/liked-themes`);
  };

  return (
    <Box w="100%">
      <Flex mih={300} direction="row" gap={10} mt={60}>
        <UserDetailCard
          userImage={user.image}
          userName={user.name}
          sumThemeLikes={sumThemeLikes}
          themeDeveloperLikes={themeDeveloperLikes}
          githuburl={githubUrl}
          user={user}
        />
        <Card mih={20} sx={{ flexGrow: 1 }}>
          <Card.Section withBorder inheritPadding py="md">
            <div>自己紹介</div>
          </Card.Section>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Text
              mah={200}
              sx={() => {
                return { overflow: "auto" };
              }}
            >
              {user.profile}
            </Text>
          </Card.Section>
        </Card>
      </Flex>
      <Flex mt={50} justify="center">
        <Button.Group>
          <UserDetailTab
            type="post"
            activeType={type}
            onClick={handleSwitchPost}
          >
            投稿したお題
          </UserDetailTab>
          <UserDetailTab
            type="join"
            activeType={type}
            onClick={handleSwitchJoin}
          >
            参加したお題
          </UserDetailTab>
          <UserDetailTab
            type="like"
            activeType={type}
            onClick={handleSwitchLike}
          >
            いいねしたお題
          </UserDetailTab>
        </Button.Group>
      </Flex>
    </Box>
  );
};
