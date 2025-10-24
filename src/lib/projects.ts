export interface Project {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: "example",
    name: "Example Project",
    description: "A simple example to demonstrate the sandbox pattern",
    path: "/example",
    icon: "📝",
  },
  {
    id: "counter",
    name: "Counter Demo",
    description: "Interactive counter with state management",
    path: "/counter",
    icon: "🔢",
  },
  // Add your new projects here following this pattern
];
