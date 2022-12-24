import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { BsDot } from "react-icons/bs";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";
import { useSearchedUsersQuery } from "../hooks/useSearchedUsersQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { AppTextInput } from "./AppTextInput";
import { ThemeLikingUserCard } from "./ThemeLikingUserCard";

export const UserSearchPage: React.FC = () => {
  const [userName, setUserName] = useStateAndUrlParamString({
    paramName: "userName",
    initialData: "",
  });

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const mantineTheme = useMantineTheme();

  const { resultUserNames } = useSearchedUsersQuery(userName);
  return (
    <Box>
      <Flex direction="column" align={"center"}>
        <Card w="50%">
          <Stack>
            <Title order={5}>検索</Title>

            <AppTextInput
              label="ユーザ名"
              value={userName}
              onChange={handleChangeUserName}
            />
          </Stack>
        </Card>
        <Stack mt={30}>
          {resultUserNames?.length === 0 ? (
            <Flex direction={"column"} gap={30}>
              <Flex justify={"center"} align={"center"}>
                <MdOutlinePersonSearch
                  size={70}
                  color={mantineTheme.colors.red[7]}
                />
                <BsDot size={40} color={mantineTheme.colors.red[3]} />
                <BsDot size={40} color={mantineTheme.colors.red[4]} />
                <BsDot size={40} color={mantineTheme.colors.red[5]} />
                <BsDot size={40} color={mantineTheme.colors.red[6]} />
                <RiQuestionMark size={80} color={mantineTheme.colors.red[7]} />
              </Flex>
              <Text align="center" c="gray.5">
                ユーザがいません<br></br>
                <Text align="center" c="gray.5">
                  {" "}
                  別の条件をお試しください。
                </Text>
              </Text>
            </Flex>
          ) : (
            <Box
              sx={(theme) => ({
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: theme.spacing.md,
              })}
            >
              {resultUserNames?.map((user) => {
                return (
                  <ThemeLikingUserCard
                    key={user.id}
                    userImage={user.image}
                    userName={user.name}
                  />
                );
              })}
            </Box>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
