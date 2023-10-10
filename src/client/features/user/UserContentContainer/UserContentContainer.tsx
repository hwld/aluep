import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  itemMinWidthPx: number;
  emptyProps: {
    isEmpty: boolean;
    icon: ReactNode;
    text: string;
    description: ReactNode;
  };
};

export const UserContentContainer: React.FC<Props> = ({
  children,
  page,
  onChangePage,
  totalPages,
  itemMinWidthPx,
  emptyProps: { isEmpty, icon, text, description },
}) => {
  return (
    <Stack w="100%">
      {isEmpty ? (
        <Flex align="center" direction="column">
          <EmptyContentItem icon={icon} text={text} description={description} />
        </Flex>
      ) : (
        <GridContainer minItemWidthPx={itemMinWidthPx}>
          {children}
        </GridContainer>
      )}

      <AppPagination value={page} onChange={onChangePage} total={totalPages} />
    </Stack>
  );
};
