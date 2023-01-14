import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { NextPage } from "next";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);

const Signout: NextPage = () => {
  const mantineTheme = useMantineTheme();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Card w={500} m="auto" p="xl">
      <Stack align="center" spacing="lg">
        <Title order={2}>ログアウト</Title>
        <Stack align="center" spacing="xs">
          <Flex align="center" justify="center">
            <Image src="/logo.svg" width={200} height={200} alt="app-logo" />
            <MdLogout size="20%" color={mantineTheme.colors.red[7]} />
          </Flex>
          <Stack align="center" spacing="sm">
            <Text>ログアウトしてもよろしいですか？</Text>
            <Button
              leftIcon={<MdLogout size={25} />}
              color={"red"}
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
