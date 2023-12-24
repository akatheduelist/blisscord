import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility functions for use in the app
// Using TailWind Merge to merge redundant classes in CSS
export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) }
