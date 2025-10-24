# Adding New Projects

This guide explains how to add a new project to the sandbox.

## Quick Start

### 1. Create a New Route Folder

Create a new folder in `src/app/` with your project name:

```bash
mkdir src/app/my-new-project
```

### 2. Create a Page Component

Create a `page.tsx` file in your new folder:

```typescript
// src/app/my-new-project/page.tsx
export default function MyNewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My New Project</h1>
      <p>Your content here</p>
    </div>
  );
}
```

### 3. Register Your Project

Add your project to `src/lib/projects.ts`:

```typescript
export const projects: Project[] = [
  // ... existing projects
  {
    id: "my-new-project",
    name: "My New Project",
    description: "Brief description of what this project does",
    path: "/my-new-project",
    icon: "🚀", // Choose an emoji icon
  },
];
```

That's it! Your project will automatically appear in the sidebar navigation.

## Using Components

Import and use the common components:

```typescript
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";

export default function MyPage() {
  return (
    <Card title="My Card">
      <Input label="Name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Using Utilities

Import utility functions:

```typescript
import { cn, formatDate, debounce } from "@/utils/helpers";
import { isValidEmail, isValidUrl } from "@/utils/validation";
```

## Client-Side Interactivity

For interactive features, use the `"use client"` directive:

```typescript
"use client";

import { useState } from "react";

export default function InteractivePage() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Styling

Use Tailwind CSS classes for styling:

```typescript
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
</div>
```

## API Routes (Optional)

Create API endpoints in `src/app/api/`:

```typescript
// src/app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello World" });
}
```

## Testing Your Project

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/your-project-name`

3. Check that your project appears in the sidebar

## Best Practices

- Keep pages focused and modular
- Reuse existing components when possible
- Follow the existing code style
- Add meaningful descriptions in `projects.ts`
- Test on both light and dark modes
- Ensure responsive design with Tailwind breakpoints
