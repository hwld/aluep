import { Button, Card, Flex, Text } from "@mantine/core";
import { User } from "@prisma/client";
import React, { useState } from "react";
import { useJoinThemesQuery } from "../hooks/useJoinThemesQuery";
import { useLikeThemesQuery } from "../hooks/useLikeThemesQuery";
import { usePostThemesQuery } from "../hooks/usePostThemesQuery";
import { useThemeDeveloperLikesQuery } from "../hooks/useThemeDeveloperLikesQuery";
import { useThemeLikesForUserQuery } from "../hooks/useThemeLikesForUserQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";
import UserDetailCard from "./UserDetailCard";

type Props = { user: User };

export const UserDetailAnotherPage: React.FC<Props> = ({ user }) => {
  const { postThemes } = usePostThemesQuery(user.id);

  const { joinThemes } = useJoinThemesQuery(user.id);

  const { likeThemes } = useLikeThemesQuery(user.id);

  const { themeLikes } = useThemeLikesForUserQuery(user.id);

  const { themeDeveloperLikes } = useThemeDeveloperLikesQuery(user.id);

  let githubUrl: string = "https://github.com/";
  githubUrl += user.name;

  const [state, setState] = useState<"post" | "join" | "like">("post");

  const handleSwitchPost = () => {
    setState("post");
  };
  const handleSwitchJoin = () => {
    setState("join");
  };
  const handleSwitchLike = () => {
    setState("like");
  };

  const panel = () => {
    if (state === "post") {
      return (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            {postThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </div>
      );
    } else if (state === "join") {
      return (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            {joinThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </div>
      );
    } else {
      return (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            {likeThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </div>
      );
    }
  };

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex maw={1000} mih={300} direction="row" gap={10} mt={60}>
        <UserDetailCard
          userImage={user.image}
          userName={user.name}
          themeLikes={themeLikes}
          themeDeveloperLikes={themeDeveloperLikes}
          githuburl={githubUrl}
        />

        <Card mih={20} w={500}>
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
      <Flex mt={30}>
        <Button.Group>
          <Button
            variant="light"
            w={140}
            onClick={handleSwitchPost}
            bg={state === "post" ? "gray.0" : "gray.3"}
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
            bg={state === "join" ? "gray.0" : "gray.3"}
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
            bg={state === "like" ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            いいねしたお題
          </Button>
        </Button.Group>
      </Flex>
      {panel()}
    </Flex>
  );
};
