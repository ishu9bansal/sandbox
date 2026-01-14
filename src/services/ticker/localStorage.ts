import type { PremiumSnapshot } from '@/models/ticker';

const STORAGE_KEY = 'straddle_premium_data';

/**
 * Load straddle premium data from localStorage
 */
export function loadStraddleData(): PremiumSnapshot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading straddle data from localStorage:', error);
  }
  return [];
}

/**
 * Save straddle premium data to localStorage
 */
export function saveStraddleData(data: PremiumSnapshot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving straddle data to localStorage:', error);
  }
}

/**
 * Clear straddle premium data from localStorage
 */
export function clearStraddleData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing straddle data from localStorage:', error);
  }
}
