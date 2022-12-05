import {
  Avatar,
  Button,
  Card,
  Flex,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { MdOutlineFavorite } from "react-icons/md";
import { useAllThemesQuery } from "../hooks/useAllThemesQuery";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { useThemeLike } from "../hooks/useThemeLike";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";

type Props = { developer: Session["user"] };

export const DeveloperDetailPage: React.FC<Props> = ({ developer }) => {
  const { session } = useSessionQuery();
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);
  const { allThemes } = useAllThemesQuery();

  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(themeId);

  const { developers, likeDeveloperMutation } =
    useThemeDevelopersQuery(themeId);

  const handleLikeTheme = () => {
    if (!theme) return;
    likeThemeMutation.mutate({
      themeId: theme?.id,
      like: !likedByLoggedInUser,
    });
  };

  const mantineTheme = useMantineTheme();

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
          <Card>
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
          </Card>

          <Flex gap={70} mt={10} wrap="wrap" justify={"center"}>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <MdOutlineFavorite size="30" style={{ marginTop: "4px" }} />

              {/* {themes.map((theme) => {
              if (theme.user.id === session?.user.id) {
                return <ThemeCard key={theme.id} theme={theme} />;
              }
            })} */}
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
            <Textarea placeholder="自己紹介..." withAsterisk readOnly />
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
            {allThemes?.map((theme) => {
              if (theme.user.id === session?.user.id) {
                return <ThemeCard key={theme.id} theme={theme} />;
              }
            })}
          </Flex>
        </div>
      )}
      {isJoinTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap">
            参加しているお題を表示
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
