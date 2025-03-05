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
 * Formats a date for display in the chat - always show as today's time
 */
export function formatDate(date: Date): string {
  const messageDate = new Date(date);
  
  // Just show the time in HH:MM format
  return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
