import { Button, Card, Flex, Pagination, Text } from "@mantine/core";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useJoinThemesQuery } from "../hooks/useJoinThemesQuery";
import { useLikeThemesQuery } from "../hooks/useLikeThemesQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import { usePostThemesQuery } from "../hooks/usePostThemesQuery";
import { useSumThemeLikesQuery } from "../hooks/useSumThemeLikesQuery";
import { useThemeDeveloperLikesQuery } from "../hooks/useThemeDeveloperLikesQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";
import UserDetailCard from "./UserDetailCard";

type Props = { user: Session["user"] };

export const UserDetailPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const [postPage, setPostPage] = usePaginationState({});
  const [likePage, setLikePage] = usePaginationState({});

  const { postThemes } = usePostThemesQuery(user.id);

  const { joinThemes } = useJoinThemesQuery(user.id);

  const { likeThemes } = useLikeThemesQuery(user.id);

  const { sumThemeLikes } = useSumThemeLikesQuery(user.id);

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
        <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
          {postThemes?.postThemes.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}

          <Pagination
            page={joinPage}
            onChange={setJoinPage}
            total={postThemes?.allPages ?? 0}
          />
        </Flex>
      );
    } else if (state === "join") {
      return (
        <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
          {joinThemes?.joinPostedTheme.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}
          <Pagination
            page={postPage}
            onChange={setPostPage}
            total={joinThemes?.allPages ?? 0}
          />
        </Flex>
      );
    } else {
      return (
        <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
          {likeThemes?.likePostedTheme.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}

          <Pagination
            page={likePage}
            onChange={setLikePage}
            total={likeThemes?.allPages ?? 0}
          />
        </Flex>
      );
    }
  };

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex maw={1000} mih={300} direction="row" gap={10} mt={60}>
        <UserDetailCard
          userImage={user.image}
          userName={user.name}
          sumThemeLikes={sumThemeLikes}
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
