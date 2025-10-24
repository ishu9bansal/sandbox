import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
