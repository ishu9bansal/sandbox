import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input without label
export const Basic: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// Input with label
export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

// Input with error
export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
};

// Input with value
export const WithValue: Story = {
  args: {
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your name',
  },
};

// Disabled input
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

// Disabled with value
export const DisabledWithValue: Story = {
  args: {
    label: 'Read-only Field',
    value: 'Cannot be edited',
    disabled: true,
  },
};

// Email input
export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

// Password input
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

// Number input
export const Number: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
};

// Required input
export const Required: Story = {
  args: {
    label: 'Required Field *',
    placeholder: 'This field is required',
    required: true,
  },
};

// Different states showcase
export const AllStates: Story = {
  args: {
    placeholder: 'Enter text',
  },
  render: () => (
    <div className="space-y-4">
      <Input 
        label="Normal Input" 
        placeholder="Regular state" 
      />
      <Input 
        label="With Value" 
        value="Some text content"
        placeholder="Input with value" 
      />
      <Input 
        label="With Error" 
        error="This field is required"
        placeholder="Error state" 
      />
      <Input 
        label="Disabled Input" 
        disabled 
        placeholder="Disabled state" 
      />
      <Input 
        label="Disabled with Value" 
        value="Read-only content"
        disabled 
      />
    </div>
  ),
};

// Form example
export const FormExample: Story = {
  args: {
    placeholder: 'Enter text',
  },
  render: () => (
    <div className="space-y-4">
      <Input 
        label="First Name" 
        placeholder="Enter your first name"
        required
      />
      <Input 
        label="Last Name" 
        placeholder="Enter your last name"
        required
      />
      <Input 
        label="Email Address" 
        type="email"
        placeholder="you@example.com"
        required
      />
      <Input 
        label="Phone Number" 
        type="tel"
        placeholder="+1 (555) 123-4567"
      />
      <Input 
        label="Password" 
        type="password"
        placeholder="Enter a secure password"
        required
      />
    </div>
  ),
};
