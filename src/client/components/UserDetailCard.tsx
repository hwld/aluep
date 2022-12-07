import { ActionIcon, Avatar, Box, Card, Flex, Tooltip } from "@mantine/core";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillFilePostFill } from "react-icons/bs";
import { GoMarkGithub } from "react-icons/go";

type Props = {
  userImage?: string | null;
  userName?: string | null;
  themeLikes?: number;
  themeDeveloperLikes?: number;
  githuburl?: string;
};
function UserDetailCard({
  userImage,
  userName,
  themeLikes,
  themeDeveloperLikes,
  githuburl,
}: Props) {
  return (
    <Card h={300} w={250}>
      <Card.Section py="xl">
        <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
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
          {userName}
        </Flex>
      </Card.Section>
      <Flex gap={40} mt={10} wrap="wrap" justify={"center"}>
        <Box>
          <Tooltip
            label="お題のいいねの合計"
            color="gray.5"
            position="top"
            withArrow
            transition="pop"
          >
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <BsFillFilePostFill size="30" style={{ marginTop: "4px" }} />
              {themeLikes}
            </Flex>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip
            label="ユーザのいいねの合計"
            color="gray.5"
            position="top"
            withArrow
            transition="pop"
          >
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <AiOutlineUser size="30" style={{ marginTop: "4px" }} />
              {themeDeveloperLikes}
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
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <GoMarkGithub size="30" style={{ marginTop: "4px" }} />
              <ActionIcon component={Link} href={"/"}>
                git
              </ActionIcon>
            </Flex>
          </Tooltip>
        </Box>
      </Flex>
    </Card>
  );
}

export default UserDetailCard;
