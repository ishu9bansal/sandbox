"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "@/lib/projects";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          min-h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${!isOpen ? "md:w-0 md:border-0 md:overflow-hidden" : ""}
        `}
      >
        <div className="p-6">
          <Link href="/" className="block" onClick={() => {
            if (window.innerWidth < 768) closeSidebar();
          }}>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sandbox
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Web Projects
            </p>
          </Link>
        </div>

        <nav className="px-4 pb-4">
          <div className="mb-6">
            <Link
              href="/"
              onClick={() => {
                if (window.innerWidth < 768) closeSidebar();
              }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              🏠 Home
            </Link>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Projects
            </h3>
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={project.path}
                    onClick={() => {
                      if (window.innerWidth < 768) closeSidebar();
                    }}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      pathname === project.path
                        ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {project.icon} {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
