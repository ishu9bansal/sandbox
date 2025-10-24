import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title displayed at the top of the card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card without title
export const Basic: Story = {
  args: {
    children: (
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          This is a basic card without a title. It can contain any content you want to display.
        </p>
      </div>
    ),
  },
};

// Card with title
export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: (
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          This card has a title and some content below it. The title is displayed prominently at the top.
        </p>
      </div>
    ),
  },
};

// Card with rich content
export const WithRichContent: Story = {
  args: {
    title: 'User Profile',
    children: (
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-gray-900 dark:text-white font-medium">John Doe</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-gray-900 dark:text-white font-medium">john.doe@example.com</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <p className="text-gray-900 dark:text-white font-medium">Developer</p>
        </div>
      </div>
    ),
  },
};

// Card with actions
export const WithActions: Story = {
  args: {
    title: 'Confirm Action',
    children: (
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Confirm
          </button>
        </div>
      </div>
    ),
  },
};

// Card with list
export const WithList: Story = {
  args: {
    title: 'Features',
    children: (
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Easy to use interface</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Responsive design</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Dark mode support</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Customizable styles</span>
        </li>
      </ul>
    ),
  },
};

// Compact card
export const Compact: Story = {
  args: {
    title: 'Notification',
    children: (
      <p className="text-sm text-gray-700 dark:text-gray-300">
        You have 3 new messages
      </p>
    ),
  },
};

// Multiple cards showcase
export const MultipleCards: Story = {
  args: {
    children: <p>Card content</p>,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '800px' }}>
      <Card title="Card 1">
        <p className="text-gray-700 dark:text-gray-300">First card content</p>
      </Card>
      <Card title="Card 2">
        <p className="text-gray-700 dark:text-gray-300">Second card content</p>
      </Card>
      <Card>
        <p className="text-gray-700 dark:text-gray-300">Card without title</p>
      </Card>
      <Card title="Card 4">
        <p className="text-gray-700 dark:text-gray-300">Fourth card content</p>
      </Card>
    </div>
  ),
};
