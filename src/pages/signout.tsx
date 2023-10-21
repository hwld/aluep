import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { Button, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { TbLogout } from "react-icons/tb";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }
  }
);

const Signout: NextPage = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: Routes.home });
  };

  return (
    <Card w={500} m="auto" p="xl">
      <Stack align="center" gap="lg">
        <Title order={2}>ログアウト</Title>
        <Stack align="center" gap="xs">
          <Flex align="center" justify="center">
            <Image
              src="/app-logo.svg"
              width={200}
              height={200}
              alt="app-logo"
            />
            <TbLogout size="20%" color="var(--mantine-color-red-7)" />
          </Flex>
          <Stack align="center" gap="sm">
            <Text>ログアウトしてもよろしいですか？</Text>
            <Button
              leftSection={<TbLogout size={25} />}
              color="red"
              onClick={handleSignOut}
              w="fit-content"
            >
              ログアウト
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default Signout;
