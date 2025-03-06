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
 * Formats a date for display in the chat - show time and day like WhatsApp
 */
export function formatDate(date: Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Same day - just show time
  if (messageDate.toDateString() === now.toDateString()) {
    return time;
  }
  
  // Yesterday - show "Yesterday" and time
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${time}`;
  }
  
  // Within the last 7 days - show day name and time
  const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return `${messageDate.toLocaleDateString([], { weekday: 'long' })}, ${time}`;
  }
  
  // Older messages - show date and time
  return `${messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}, ${time}`;
}
