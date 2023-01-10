import { Flex, Stack } from "@mantine/core";
import { User } from "@prisma/client";
import { PropsWithChildren } from "react";
import { AppPagination } from "../AppPagination";
import { UserDetail, UserDetailProps } from "./UserDetail";

type Props = {
  user: User;
  page: number;
  onChangePostPage: (page: number) => void;
  totalPages: number;
  pageType: UserDetailProps["type"];
} & PropsWithChildren;

export const UserDetailLayout: React.FC<Props> = ({
  user,
  children,
  page,
  onChangePostPage,
  totalPages,
  pageType,
}) => {
  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetail user={user} type={pageType} />
      <Stack mt="md">
        <Flex gap="xs" direction="column">
          {children}
        </Flex>
        <AppPagination
          page={page}
          onChange={onChangePostPage}
          total={totalPages}
        />
      </Stack>
    </Flex>
  );
};
