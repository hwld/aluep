import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  userIconSrc: string | null;
  userId?: string;
  title: ReactNode;
  content?: ReactNode;
};

export const UserSection: React.FC<Props> = ({
  userIconSrc,
  userId,
  title,
  content,
}) => {
  return (
    <Flex gap="xs" align="flex-start" w="100%" p="2px">
      {userId ? (
        <UserIconLink iconSrc={userIconSrc} userId={userId} />
      ) : (
        <UserIcon iconSrc={userIconSrc} />
      )}
      <Stack
        gap="xs"
        miw={0}
        w="100%"
        justify="center"
        style={{ overflow: "hidden", alignSelf: "center" }}
      >
        {title}
        {content}
      </Stack>
    </Flex>
  );
};
