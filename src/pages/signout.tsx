import { Box, Button, Flex, Text } from "@mantine/core";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

function signout() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Box w={600} m="auto">
      <Flex justify={"center"}>
        <Box mt="xl">
          <Flex direction={"column"} gap={30}>
            <Text>ログアウトしてもよろしいですか？</Text>

            <Button
              leftIcon={<MdLogout size={30} />}
              color={"red"}
              onClick={handleSignOut}
            >
              ログアウト
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default signout;
