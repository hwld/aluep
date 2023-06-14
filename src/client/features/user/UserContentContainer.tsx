import { Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";
import { AppPagination } from "../../ui/AppPagination";
import { GridContainer } from "../../ui/GridContainer";
import { EmptyUserContentItem } from "./EmptyUserContentItem";

type Props = {
  children: ReactNode;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  itemMinWidthPx: number;
  isEmpty: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
  emptyDescription: ReactNode;
};
export const UserContentContainer: React.FC<Props> = ({
  children,
  page,
  onChangePage,
  totalPages,
  itemMinWidthPx,
  isEmpty,
  emptyIcon,
  emptyText,
  emptyDescription,
}) => {
  return (
    <Stack w="100%">
      {isEmpty ? (
        <Flex align="center" direction="column">
          <EmptyUserContentItem
            icon={emptyIcon}
            text={emptyText}
            description={emptyDescription}
          />
        </Flex>
      ) : (
        <GridContainer minItemWidthPx={itemMinWidthPx}>
          {children}
        </GridContainer>
      )}

      <AppPagination page={page} onChange={onChangePage} total={totalPages} />
    </Stack>
  );
};
