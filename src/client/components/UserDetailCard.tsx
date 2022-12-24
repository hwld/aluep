import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Flex,
  Text,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillFilePostFill } from "react-icons/bs";
import { GoMarkGithub } from "react-icons/go";

type Props = {
  userImage?: string | null;
  userName?: string | null;
  sumThemeLikes?: number;
  themeDeveloperLikes?: number;
  githuburl?: string;
};
export function UserDetailCard({
  userImage,
  userName,
  sumThemeLikes,
  themeDeveloperLikes,
  githuburl,
}: Props) {
  if (githuburl === undefined) {
    githuburl = "/";
  }
  return (
    <Card h={300} w={250}>
      <Flex direction={"column"} justify={"space-between"} h="100%">
        <Flex align={"center"} gap={20} wrap="wrap" direction={"column"}>
          <Avatar
            src={userImage}
            size="xl"
            sx={(theme) => ({
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
              borderRadius: "100%",
            })}
          />
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <Text>{userName}</Text>
        </Flex>

        <Flex gap={40} mt={10} wrap="wrap" justify={"center"}>
          <Box>
            <Tooltip
              label="投稿したお題のいいねの合計"
              color="gray.5"
              position="top"
              withArrow
              transition="pop"
            >
              <Flex align={"center"} wrap="wrap" direction={"column"}>
                <BsFillFilePostFill size="30" style={{ marginTop: "4px" }} />
                <Text>{sumThemeLikes}</Text>
              </Flex>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              label="参加したお題のいいねの合計"
              color="gray.5"
              position="top"
              withArrow
              transition="pop"
            >
              <Flex align={"center"} wrap="wrap" direction={"column"}>
                <AiOutlineUser size="30" style={{ marginTop: "4px" }} />
                <Text>{themeDeveloperLikes}</Text>
              </Flex>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              label="GitHubへのアクセス"
              color="gray.5"
              position="top"
              withArrow
              transition="pop"
            >
              <Flex align={"center"} wrap="wrap" direction={"column"}>
                <GoMarkGithub size="30" style={{ marginTop: "4px" }} />
                <ActionIcon component={Link} href={githuburl}>
                  <Text>git</Text>
                </ActionIcon>
              </Flex>
            </Tooltip>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
