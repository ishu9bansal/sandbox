import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Sandbox</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          A ready-to-use environment for your web project ideas. Add new routes, experiment with components, and build without setup overhead.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Add a New Project</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create a new folder in <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/app</code> for your project route
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Register Your Project</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Add it to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/lib/projects.ts</code> to show it in the sidebar
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Use Common Components</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Leverage shared components from <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/components</code> and utilities from <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/utils</code>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.path}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <span className="text-blue-500 hover:text-blue-600 font-medium">
                View Project →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
