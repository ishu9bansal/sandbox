import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const PrimarySmall: Story = {
  args: {
    children: 'Small Primary',
    variant: 'primary',
    size: 'sm',
  },
};

export const PrimaryLarge: Story = {
  args: {
    children: 'Large Primary',
    variant: 'primary',
    size: 'lg',
  },
};

// Secondary variant stories
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const SecondarySmall: Story = {
  args: {
    children: 'Small Secondary',
    variant: 'secondary',
    size: 'sm',
  },
};

export const SecondaryLarge: Story = {
  args: {
    children: 'Large Secondary',
    variant: 'secondary',
    size: 'lg',
  },
};

// Outline variant stories
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'md',
  },
};

export const OutlineSmall: Story = {
  args: {
    children: 'Small Outline',
    variant: 'outline',
    size: 'sm',
  },
};

export const OutlineLarge: Story = {
  args: {
    children: 'Large Outline',
    variant: 'outline',
    size: 'lg',
  },
};

// Disabled states
export const PrimaryDisabled: Story = {
  args: {
    children: 'Disabled Primary',
    variant: 'primary',
    disabled: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    children: 'Disabled Secondary',
    variant: 'secondary',
    disabled: true,
  },
};

export const OutlineDisabled: Story = {
  args: {
    children: 'Disabled Outline',
    variant: 'outline',
    disabled: true,
  },
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="secondary" size="sm">Small</Button>
        <Button variant="secondary" size="md">Medium</Button>
        <Button variant="secondary" size="lg">Large</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="sm">Small</Button>
        <Button variant="outline" size="md">Medium</Button>
        <Button variant="outline" size="lg">Large</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </div>
    </div>
  ),
};
