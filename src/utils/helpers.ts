/**
 * Combines multiple class names into a single string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Debounce function to limit execution rate
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    throw new Error("Clipboard API not supported");
  }
}

/** Compare two values (number or string) for sorting
 */
export function compareNumOrString(a: number | string, b: number | string, sortDir: "asc" | "desc" = "asc"): number {
  const factor = sortDir === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") {
    return factor * (a - b);
  }
  const sa = String(a);
  const sb = String(b);
  return factor * sa.localeCompare(sb);
}

/**
 * Count and tell
 * E.g. [ 'A', 'A', 'B', 'C', 'A', 'B' ] => [{ value: 'A', count: 2 }, { value: 'B', count: 1 }, { value: 'C', count: 1 }, { value: 'A', count: 1 }, { value: 'B', count: 1 }]
 * count continuous occurrences of values in array and return array of objects with value and count
 */
export function countAndTell<T>(arr: T[]): { value: T; count: number }[] {
  const result: { value: T; count: number }[] = [];
  let currentValue: T | null = null;
  let currentCount = 0;

  for (const item of arr) {
    if (item === currentValue) {
      currentCount++;
    } else {
      if (currentValue !== null) {
        result.push({ value: currentValue, count: currentCount });
      }
      currentValue = item;
      currentCount = 1;
    }
  }

  if (currentValue !== null) {
    result.push({ value: currentValue, count: currentCount });
  }

  return result;
}

/** Convert a 2D array (table) to a CSV string
 */
export function tableToCsvString(table: string[][]): string {
  return table.map(row => row.map(value => {
    // Escape double quotes by doubling them
    const escapedValue = value.replace(/"/g, '""');
    // Wrap in double quotes if it contains a comma, newline, or double quote
    if (/[",\n]/.test(escapedValue)) {
      return `"${escapedValue}"`;
    }
    return escapedValue;
  }).join(',')).join('\n');
}

/** Convert a 2D array (table) to a TSV string
 */
export function tableToTsvString(table: string[][]): string {
  return table.map(row => row.map(value => {
    // Escape double quotes by doubling them
    const escapedValue = value.replace(/"/g, '""');
    // Wrap in double quotes if it contains a tab, newline, or double quote
    if (/[\t"\n]/.test(escapedValue)) {
      return `"${escapedValue}"`;
    }
    return escapedValue;
  }).join('\t')).join('\n');
}