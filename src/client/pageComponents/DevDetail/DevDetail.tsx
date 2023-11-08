import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { DevMemoFormCard } from "@/client/features/devMemo/DevMemoFormCard/DevMemoFormCard";
import { DevMemoThreadCard } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoThreadCard";
import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev } from "@/models/dev";
import { Card, Center, Flex, Stack, Title } from "@mantine/core";
import { IconCode, IconNote } from "@tabler/icons-react";
import React, { useRef } from "react";
import { ToggleDevMemoPermission } from "@/client/features/devMemo/ToggleDevMemoPermission/ToggleDevMemoPermission";

type Props = { dev: Dev };

export const DevDetail: React.FC<Props> = ({ dev }) => {
  const { session } = useSessionQuery();
  const loggedInUser = session?.user;
  const isDeveloper = dev.developer.id === loggedInUser?.id;

  const { devMemoThreads } = useDevMemos({
    devId: dev.id,
  });

  const memoFormCardRef = useRef<HTMLDivElement | null>(null);
  // メモスレッドが追加されたらスクロールさせる
  useAutoScrollOnIncrease({
    target: memoFormCardRef,
    count: devMemoThreads.length,
  });

  return (
    <>
      <PageHeader icon={IconCode} pageName="開発情報の詳細" />
      <Stack maw={1200} w="100%" m="auto" gap={40}>
        <DevDetailCard dev={dev} isDeveloper={isDeveloper} />
        <Stack gap="xl">
          <Flex align="center" justify="space-between" gap="xl">
            <Title order={4}>開発メモ</Title>
            {isDeveloper && (
              <>
                <Card>
                  <ToggleDevMemoPermission dev={dev} />
                </Card>
              </>
            )}
          </Flex>
          {devMemoThreads.length === 0 ? (
            <Card py={40}>
              <Center h="100%">
                <EmptyContentItem
                  icon={
                    <IconNote
                      width={120}
                      height={120}
                      color="var(--mantine-color-gray-7)"
                    />
                  }
                  text="開発メモがありません"
                  description={
                    <>
                      開発時に問題に直面したり、知見をまとめたいときに<br></br>
                      開発メモを残すことができます。
                    </>
                  }
                />
              </Center>
            </Card>
          ) : (
            <Stack gap="xs">
              {devMemoThreads.map((thread) => {
                return (
                  <DevMemoThreadCard
                    key={thread.rootMemo.id}
                    memo={thread.rootMemo}
                    devId={dev.id}
                    childrenMemos={thread.children}
                    loggedInUserId={loggedInUser?.id}
                  />
                );
              })}
            </Stack>
          )}
          {loggedInUser && isDeveloper && (
            <DevMemoFormCard
              devId={dev.id}
              ref={memoFormCardRef}
              loggedInUser={loggedInUser}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};
