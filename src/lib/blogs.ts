/**
 * Interface for blog metadata
 */
export interface BlogMetadata {
  title: string;
  description: string;
  image?: string;
  url: string;
}

/**
 * List of blogs to display on the blogs page
 * Add new blog entries here to display them as cards
 * 
 * To add a blog:
 * 1. Visit your Medium blog post
 * 2. Right-click and "View Page Source"
 * 3. Search for "og:title", "og:description", and "og:image" meta tags
 * 4. Copy the content values and add them below
 * 
 * Or use the fetchOGData utility in development to auto-fetch (may not work for all sites)
 */
export const blogs: BlogMetadata[] = [
  // Example entries for demonstration (replace with your own blogs):
  // {
  //   title: "Building Modern Web Applications",
  //   description: "A comprehensive guide to building scalable and maintainable web applications using modern technologies and best practices.",
  //   image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/building-modern-web-applications"
  // },
  // {
  //   title: "React Hooks Deep Dive",
  //   description: "Understanding React Hooks and how they revolutionize the way we write React components. Learn best practices and common patterns.",
  //   image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/react-hooks-deep-dive"
  // },
  // {
  //   title: "TypeScript Best Practices",
  //   description: "Learn how to leverage TypeScript's type system to write safer, more maintainable code with practical examples and patterns.",
  //   image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/typescript-best-practices"
  // },
  // {
  //   title: "Performance Optimization Techniques",
  //   description: "Discover proven techniques to optimize your web application's performance, from lazy loading to code splitting and caching strategies.",
  //   image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/performance-optimization"
  // },
  // {
  //   title: "Testing Frontend Applications",
  //   description: "A practical guide to testing React applications with Jest, React Testing Library, and end-to-end testing with Playwright.",
  //   image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/testing-frontend-apps"
  // },
  // {
  //   title: "CSS Grid and Flexbox Mastery",
  //   description: "Master modern CSS layout techniques with practical examples and real-world use cases for building responsive designs.",
  //   image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/css-grid-flexbox"
  // },
  // {
  //   title: "API Design Principles",
  //   description: "Learn the principles of designing RESTful APIs that are intuitive, scalable, and easy to maintain for your applications.",
  //   image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/api-design-principles"
  // },
  // {
  //   title: "State Management in React",
  //   description: "Comparing different state management solutions in React: Context API, Redux, Zustand, and more. Choose the right tool for your needs.",
  //   image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
  //   url: "https://medium.com/@example/state-management-react"
  // },
];

// Alternative: If you want to try auto-fetching OG data (may not work for all sites due to CORS/rate limits)
// Import blogUrls and use fetchMultipleOGData in the page component
export const blogUrls: string[] = [
  // Add your blog URLs here for auto-fetching (experimental)
  "https://medium.com/@ishubansal1400/the-modular-api-handler-pattern-scalable-frontend-service-calls-79dee191c273",
  "https://medium.com/@ishubansal1400/building-trustworthy-software-2f8c6674273a",
  "https://medium.com/@ishubansal1400/the-subtle-pitfalls-of-react-state-management-b1185c46ce15",
  "https://medium.com/@ishubansal1400/react-is-declarative-how-to-think-in-react-194869b1493e",
  "https://medium.com/@ishubansal1400/stop-misusing-react-and-redux-a-call-for-thoughtful-frontend-development-d12fe7744ff1",
];
