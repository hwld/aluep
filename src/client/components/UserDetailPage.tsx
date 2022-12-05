import { Avatar, Button, Card, Flex, Textarea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillFilePostFill } from "react-icons/bs";
import { GoMarkGithub } from "react-icons/go";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";
import { ThemeCard } from "./ThemeCard/ThemeCard";

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

  const [isPostTheme, setIsPostTheme] = useState(true);
  const [isJoinTheme, setIsJoinTheme] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const handlePostTheme = () => {
    if (!isPostTheme) {
      setIsPostTheme(!isPostTheme);
    }
    if (isJoinTheme) {
      setIsJoinTheme(false);
    }
    if (isLike) {
      setIsLike(false);
    }
  };

  const handleJoinTheme = () => {
    if (!isJoinTheme) {
      setIsJoinTheme(!isJoinTheme);
    }
    if (isPostTheme) {
      setIsPostTheme(false);
    }
    if (isLike) {
      setIsLike(false);
    }
  };

  const handleLike = () => {
    if (!isLike) {
      setIsLike(!isLike);
    }
    if (isPostTheme) {
      setIsPostTheme(false);
    }
    if (isJoinTheme) {
      setIsJoinTheme(false);
    }
  };

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex maw={1000} mih={300} direction="row" gap={10} mt={60}>
        <Card h={300} w={250}>
          <Card.Section py="xl">
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <Avatar
                src={session?.user.image}
                size="xl"
                sx={(theme) => ({
                  borderWidth: "2px",
                  borderColor: theme.colors.gray[2],
                  borderStyle: "solid",
                  borderRadius: "100%",
                })}
              />
              {session?.user.name}
            </Flex>
          </Card.Section>

          <Flex gap={40} mt={10} wrap="wrap" justify={"center"}>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <BsFillFilePostFill size="30" style={{ marginTop: "4px" }} />
              {themeLikes}
            </Flex>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <AiOutlineUser size="30" style={{ marginTop: "4px" }} />
              {themeDeveloperLikes}
            </Flex>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <GoMarkGithub size="30" style={{ marginTop: "4px" }} />
              <div>GitHub</div>
            </Flex>
          </Flex>
        </Card>

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
            w={130}
            onClick={handlePostTheme}
            bg={isPostTheme ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            投稿したお題
          </Button>
          <Button
            variant="light"
            w={130}
            onClick={handleJoinTheme}
            bg={isJoinTheme ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            参加したお題
          </Button>
          <Button
            variant="light"
            w={130}
            onClick={handleLike}
            bg={isLike ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            いいね
          </Button>
        </Button.Group>
      </Flex>
      {isPostTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            {postThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </div>
      )}
      {isJoinTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            {joinThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </div>
      )}
      {isLike && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap">
            いいねを表示
          </Flex>
        </div>
      )}
    </Flex>
  );
};
