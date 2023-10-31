import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { NavLink, Stack } from "@mantine/core";
import { SvgFileText } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./InProgresDevLinkList.module.css";

type Props = { devs: Dev[]; onCloseModal: () => void };

export const InProgresDevLinkList: React.FC<Props> = ({
  devs,
  onCloseModal,
}) => {
  return (
    <Stack gap={0} align="flex-start">
      {devs.map((dev) => {
        return (
          <NavLink
            onClick={onCloseModal}
            component={Link}
            href={Routes.dev(dev.id)}
            key={dev.id}
            noWrap
            label={dev?.idea?.title ?? "削除されたお題"}
            leftSection={<SvgFileText width={25} height={25} />}
            classNames={{ root: classes.link }}
            color="gray.7"
          />
        );
      })}
    </Stack>
  );
};
