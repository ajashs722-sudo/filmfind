import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRating = (rating: number) => rating.toFixed(1);

export const formatYear = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};
