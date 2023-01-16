import { Box, Button, Card, Flex, Text } from "@mantine/core";
import { User } from "@prisma/client";
import router from "next/router";
import React from "react";
import { useSumThemeLikesQuery } from "../../hooks/useSumThemeLikesQuery";
import { useThemeDeveloperLikesQuery } from "../../hooks/useThemeDeveloperLikesQuery";
import { UserDetailCard } from "../UserDetailCard";

export type UserDetailProps = { user: User; type: "post" | "join" | "like" };

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
          <Button
            variant="light"
            w={140}
            onClick={handleSwitchPost}
            bg={type === "post" ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            投稿したお題
          </Button>
          <Button
            variant="light"
            w={140}
            onClick={handleSwitchJoin}
            bg={type === "join" ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            参加したお題
          </Button>
          <Button
            variant="light"
            w={140}
            onClick={handleSwitchLike}
            bg={type === "like" ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            いいねしたお題
          </Button>
        </Button.Group>
      </Flex>
    </Box>
  );
};
