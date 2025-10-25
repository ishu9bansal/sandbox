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
  {
    id: "blogs",
    name: "My Blogs",
    description: "A collection of my writings and thoughts on Medium",
    path: "/blogs",
    icon: "📚",
  },
  // Add your new projects here following this pattern
];
