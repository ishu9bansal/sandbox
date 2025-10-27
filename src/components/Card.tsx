"use client";

import { ReactNode, useState } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export default function Card({ 
  children, 
  title, 
  collapsible = false, 
  defaultCollapsed = false,
  className = "" 
}: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {title && (
        <div 
          className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${
            collapsible ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors' : ''
          }`}
          onClick={toggleCollapse}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
            {collapsible && (
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    isCollapsed ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      <div
        className={`transition-all duration-300 ease-in-out ${
          collapsible && isCollapsed 
            ? 'max-h-0 overflow-hidden' 
            : 'max-h-none'
        }`}
      >
        <div className={title ? 'p-6' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  );
}
