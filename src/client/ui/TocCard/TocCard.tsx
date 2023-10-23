import { Card, Divider, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import tocbot from "tocbot";
import classes from "./TocCard.module.css";

type Props = { contentClassName: string };

export const TocCard: React.FC<Props> = ({ contentClassName }) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: `.${classes.toc}`,
      activeLinkClass: `${classes["is-active"]}`,
      contentSelector: `.${contentClassName}`,
      headingSelector: "h2,h3,h4",
      hasInnerContainers: true,
      scrollSmooth: false,
      orderedList: false,
    });

    return () => {
      tocbot.destroy();
    };
  }, [contentClassName]);

  return (
    <Card>
      <Stack>
        <Text fw="bold">目次</Text>
        <Divider />
        <Stack className={classes.toc}></Stack>
      </Stack>
    </Card>
  );
};
