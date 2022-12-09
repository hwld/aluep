import { Carousel } from "@mantine/carousel";
import { Box, Flex } from "@mantine/core";
import { Theme } from "../../../server/models/theme";
import { PopularThemeCard, popularThemeCardWidthPx } from "./PopularThemeCard";

type Props = { themes: Theme[] };
export const PopularThemeCarousel: React.FC<Props> = ({ themes }) => {
  // TDOO: カルーセルが自動で縮小してくれない
  return (
    <Carousel
      align="center"
      loop
      slideSize={`${popularThemeCardWidthPx}px`}
      slideGap="md"
      bg="red.7"
      // miw={`${popularThemeCardWidthPx * 2}px`}
      maw={`${popularThemeCardWidthPx * 3}px`}
      withIndicators
      height={250}
      dragFree
      styles={{
        indicators: { bottom: "10px" },
      }}
      sx={(theme) => ({
        borderRadius: theme.radius.lg,
        boxShadow: `inset ${theme.shadows.lg}`,
      })}
    >
      {themes.map((theme) => (
        <Carousel.Slide key={theme.id}>
          <Flex h="100%" w={`${popularThemeCardWidthPx}px`} align="center">
            <Box w="100%" h="80%">
              <PopularThemeCard theme={theme} />
            </Box>
          </Flex>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
