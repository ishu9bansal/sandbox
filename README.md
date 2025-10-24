# Sandbox - Web Projects Playground

A ready-to-use Next.js sandbox environment for experimenting with web projects. No more setup overhead - just add a route and start building!

## 🚀 Features

- **Pre-configured Next.js** with TypeScript and App Router
- **Tailwind CSS** for styling
- **Navigation System** with sidebar and navbar
- **Reusable Components** (Button, Card, Input, etc.)
- **Common Utilities** (helpers, validation)
- **Dark Mode** support out of the box
- **Easy Project Addition** - just create a folder and register it

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ishu9bansal/sandbox.git
cd sandbox
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Adding a New Project

### Step 1: Create a New Route

Create a new folder in `src/app` for your project:

```bash
mkdir src/app/my-project
```

### Step 2: Add a Page Component

Create a `page.tsx` file in your new folder:

```typescript
// src/app/my-project/page.tsx
export default function MyProjectPage() {
  return (
    <div>
      <h1>My Project</h1>
      <p>Your content here</p>
    </div>
  );
}
```

### Step 3: Register Your Project

Add your project to `src/lib/projects.ts`:

```typescript
export const projects: Project[] = [
  // ... existing projects
  {
    id: "my-project",
    name: "My Project",
    description: "Description of my project",
    path: "/my-project",
    icon: "🚀",
  },
];
```

That's it! Your project will now appear in the sidebar and be accessible via navigation.

## 🧩 Available Components

### Button
```typescript
import Button from "@/components/Button";

<Button variant="primary" size="md">Click Me</Button>
```

### Card
```typescript
import Card from "@/components/Card";

<Card title="My Card">
  Content here
</Card>
```

### Input
```typescript
import Input from "@/components/Input";

<Input label="Name" placeholder="Enter your name" />
```

## 🛠️ Available Utilities

### Helpers
```typescript
import { cn, formatDate, debounce, throttle } from "@/utils/helpers";
```

### Validation
```typescript
import { isValidEmail, isValidUrl, isEmpty } from "@/utils/validation";
```

## 📁 Project Structure

```
sandbox/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── example/        # Example project
│   │   ├── counter/        # Counter demo project
│   │   ├── layout.tsx      # Root layout with navigation
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── lib/                 # Library code
│   │   └── projects.ts     # Project registry
│   ├── utils/              # Utility functions
│   │   ├── helpers.ts
│   │   └── validation.ts
│   └── types/              # TypeScript types
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 Styling

This sandbox uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.ts`.

### Dark Mode

Dark mode is automatically supported. Use Tailwind's `dark:` prefix for dark mode styles:

```typescript
<div className="bg-white dark:bg-gray-800">
  Content
</div>
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a personal sandbox, but feel free to fork and customize it for your own use!

## 📄 License

ISC