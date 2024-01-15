---
name: 'component'
root: '.'
output: 'src/client/{features,pageComponents}/**/*'
ignore: []
questions:
  value: 'Please enter component name.'
---

# `{{ inputs.value | pathPascal }}.tsx`

```jsx
type Props = {};

export const {{ inputs.value | filename | pascal }}: React.FC<Props> = () => {
  return <div>{{ inputs.value | filename | pascal }}</div>
}
```

# `{{ inputs.value | pathPascal }}.stories.tsx`

```jsx
import { Meta, StoryObj } from "@storybook/react";
import { {{ inputs.value | filename | pascal }} } from "./{{ inputs.value | filename | pascal }}";

const meta = {
  component: {{ inputs.value | filename | pascal}},
} satisfies Meta<typeof {{ inputs.value | filename | pascal}}>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
```