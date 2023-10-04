import { GridContainer } from "@/client/ui/GridContainer";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: GridContainer } satisfies Meta<typeof GridContainer>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Component() {
    const minWidth = 300;

    return (
      <GridContainer minItemWidthPx={minWidth}>
        {[...new Array(5)].map((_, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                minWidth: `${minWidth}px`,
                backgroundColor: "black",
                height: "100px",
              }}
            ></div>
          );
        })}
      </GridContainer>
    );
  },
};
