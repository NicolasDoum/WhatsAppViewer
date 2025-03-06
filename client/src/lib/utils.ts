import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class values using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a date for display in the chat - show date and time
 */
export function formatDate(date: Date): string {
  const messageDate = new Date(date);
  
  // Show both date and time in a readable format
  return messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric' 
  }) + ', ' + messageDate.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
