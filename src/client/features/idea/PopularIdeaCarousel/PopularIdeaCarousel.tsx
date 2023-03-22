import { Carousel } from "@mantine/carousel";
import { Box, Flex } from "@mantine/core";
import { Idea } from "../../../../server/models/idea";
import { PopularIdeaCard, popularIdeaCardWidthPx } from "./PopularIdeaCard";

type Props = { ideas: Idea[] | undefined; miw?: string };
export const PopularIdeaCarousel: React.FC<Props> = ({ ideas, miw }) => {
  return (
    <Carousel
      align="center"
      loop
      slideSize={`${popularIdeaCardWidthPx}px`}
      miw={miw}
      slideGap="md"
      bg="red.7"
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
      nextControlLabel="次のお題に進める"
      previousControlLabel="前のお題に戻る"
    >
      {ideas && ideas.length > 0 ? (
        ideas.map((idea) => (
          <Carousel.Slide key={idea.id}>
            <Flex h="100%" w={`${popularIdeaCardWidthPx}px`} align="center">
              <Box w="100%" h="80%">
                <PopularIdeaCard idea={idea} />
              </Box>
            </Flex>
          </Carousel.Slide>
        ))
      ) : (
        <Box></Box>
      )}
    </Carousel>
  );
};
