import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { BsDot } from "react-icons/bs";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";
import { useSearchedUsersQuery } from "../hooks/useSearchedUsersQuery";
import { useURLParams } from "../hooks/useURLParams";
import { AppTextInput } from "./AppTextInput";
import { UserCard, userCardMinWidthPx } from "./UserCard";

export const UserSearchPage: React.FC = () => {
  const [urlParam, setURLParams] = useURLParams({
    userName: "",
  });
  const [userName, setUserName] = useState(urlParam.userName);

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURLParams({ userName: e.target.value });
    setUserName(e.target.value);
  };
  const mantineTheme = useMantineTheme();

  const { resultUserNames } = useSearchedUsersQuery(userName);
  return (
    <Box>
      <Flex
        direction="column"
        w="50%"
        sx={() => ({
          marginLeft: "auto",
          marginRight: "auto",
        })}
      >
        <Card
          sx={() => ({
            position: "static",
          })}
        >
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
          {/* 検索ボックスが空 */}
          {userName === "" ? (
            <Flex direction={"column"} gap={30}>
              <Flex justify={"center"} align={"center"}>
                <MdOutlinePersonSearch
                  size={100}
                  color={mantineTheme.colors.red[7]}
                />
              </Flex>
              <Text align="center" c="gray.5">
                ユーザを検索してみよう!
              </Text>
            </Flex>
          ) : resultUserNames?.length !== 0 ? (
            //検索結果がn件以上の場合
            <>
              {resultUserNames?.length === 30 ? (
                <>
                  <Box
                    sx={(theme) => ({
                      display: "grid",
                      gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
                      gap: theme.spacing.md,
                    })}
                  >
                    {resultUserNames?.map((user) => {
                      return <UserCard key={user.id} user={user} />;
                    })}
                  </Box>

                  <Text align="center" c="gray.5">
                    ユーザの検索結果が30件以上見つかったため、30件のみ表示しています。
                  </Text>
                </>
              ) : (
                //検索結果がn件未満の場合
                <Box
                  sx={(theme) => ({
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
                    gap: theme.spacing.md,
                  })}
                >
                  {resultUserNames?.map((user) => {
                    return <UserCard key={user.id} user={user} />;
                  })}
                </Box>
              )}
            </>
          ) : (
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
                  別の条件をお試しください。
                </Text>
              </Text>
            </Flex>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
