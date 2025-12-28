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
  {
    id: "backtest",
    name: "Backtest Visualizer",
    description: "Interactive P&L visualization for options trading backtest results",
    path: "/backtest",
    icon: "📊",
  },
  {
    id: "cng",
    name: "CNG station buddy",
    description: "Give your drivers seemless way to update their truck offload status",
    path: "/cng",
    icon: "🚛",
  },
  {
    id: "perio",
    name: "Perio Charting",
    description: "Tooth charting application for dental professionals",
    path: "/periodontics",
    icon: "🦷",
  },
  {
    id: "patients",
    name: "Patient Management",
    description: "Manage patient records with CRUD operations and data persistence",
    path: "/patients",
    icon: "🏥",
  },
  {
    id: "perio-example",
    name: "Perio Example Input",
    description: "Tooth charting example",
    path: "/perio",
    icon: "🦷",
  },
  // Add your new projects here following this pattern
];
