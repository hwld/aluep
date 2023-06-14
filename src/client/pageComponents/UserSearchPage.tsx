import { Box, Card, Flex, Stack, TextInput, Title } from "@mantine/core";
import { useRef, useState } from "react";
import { z } from "zod";
import { userCardMinWidthPx } from "../features/user/UserCard";
import { UserSearchResultContent } from "../features/user/UserSearchResultContent";
import { useSearchedUsersQuery } from "../features/user/useSearchedUsersQuery";
import { useURLParams } from "../lib/useURLParams";

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

  const { searchedUserResult } = useSearchedUsersQuery(userNameFromURLParams);

  return (
    <Box>
      <Flex
        direction="column"
        w="100%"
        maw={750}
        miw={userCardMinWidthPx}
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
            // userNameを直接使用すると、空文字から文字を入力したときの再レンダリングで
            // ここがfalseになってしまい、検索結果が存在しないというUIが一瞬表示されてしまう
            // そのちらつきを防ぐために、遅延された入力を使用する
            isEmptyKeyword={userNameFromURLParams === ""}
          />
        </Stack>
      </Flex>
    </Box>
  );
};
