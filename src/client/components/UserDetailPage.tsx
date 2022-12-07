import { Button, Card, Flex, Textarea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";
import { ThemeCard } from "./ThemeCard/ThemeCard";
import UserDetailCard from "./UserDetailCard";

type Props = { user: Session["user"] };

export const UserDetailPage: React.FC<Props> = ({ user }) => {
  const { session } = useSessionQuery();
  //投稿しているお題の表示
  const { data: postThemes } = useQuery({
    queryKey: ["postThemes"],
    queryFn: () => {
      return trpc.user.getPostTheme.query({ userId: user.id });
    },
  });
  //参加しているお題の表示
  const { data: joinThemes } = useQuery({
    queryKey: ["joinThemes"],
    queryFn: () => {
      return trpc.user.getJoinTheme.query({ userId: user.id });
    },
  });
  //いいねしたお題の表示
  const { data: likeThemes } = useQuery({
    queryKey: ["likeThemes"],
    queryFn: () => {
      return trpc.user.getLikeTheme.query({ userId: user.id });
    },
  });

  //お題のいいねの合計
  const { data: themeLikes } = useQuery({
    queryKey: ["themeLikes"],
    queryFn: () => {
      return trpc.user.getThemeLike.query({ userId: user.id });
    },
  });
  //参加しているお題のいいねの合計
  const { data: themeDeveloperLikes } = useQuery({
    queryKey: ["themeDeveloperLikes"],
    queryFn: () => {
      return trpc.user.getThemeDeveloperLike.query({ userId: user.id });
    },
  });

  // const { data: githuburl } = useQuery({
  //   queryKey: ["githuburl"],
  //   queryFn: () => {
  //     return trpc.user.getGithub.query({ userId: user.id });
  //   },
  // });
  const githubUrl: string = "/";

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
            <Textarea placeholder="自己紹介..." withAsterisk />
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
