import { userCardMinWidthPx } from "@/client/features/user/UserCard/UserCard";
import { UserSearchResultContent } from "@/client/features/user/UserSearchResultContent/UserSearchResultContent";
import { useSearchedUsersQuery } from "@/client/features/user/useSearchedUsersQuery";
import { useURLParams } from "@/client/lib/useURLParams";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Box, Card, Flex, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { z } from "zod";

export const UserSearchPage: React.FC = () => {
  const [{ userName: userNameFromURLParams }, setURLParams] = useURLParams(
    z.object({ userName: z.string().default("") })
  );
  const [userName, setUsername] = useState(userNameFromURLParams);

  const timerRef = useRef<undefined | number>(undefined);
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // 最後に文字が入力されてから200ms後にURLParamを更新する
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setURLParams({ userName: value });
    }, 200);
  };

  const { searchedUserResult } = useSearchedUsersQuery({
    userName: userNameFromURLParams,
  });

  return (
    <>
      <PageHeader icon={IconSearch} pageName="ユーザーの検索" />
      <Box>
        <Flex
          direction="column"
          w="100%"
          maw={1200}
          miw={userCardMinWidthPx}
          style={() => ({
            marginLeft: "auto",
            marginRight: "auto",
          })}
        >
          <Card
            style={() => ({
              position: "static",
            })}
          >
            <Stack>
              <Title order={5}>検索</Title>

              <TextInput
                label="ユーザ名"
                value={userName}
                onChange={handleChangeUserName}
              />
            </Stack>
          </Card>
          <Stack mt={30}>
            <UserSearchResultContent
              userSearchResult={searchedUserResult ?? []}
              // URLParamsにあるuserNameが空のときに専用のUIを表示させる
              // userNameが変更されてから検索が実行されるまでに遅延があるので、
              // userNameではなく遅延されたuserNameFromURLParamsを使用する。
              isEmptyKeyword={userNameFromURLParams === ""}
            />
          </Stack>
        </Flex>
      </Box>
    </>
  );
};
