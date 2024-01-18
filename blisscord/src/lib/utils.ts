import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility functions for use in the app
// Using TailWind Merge to merge redundant classes in CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Takes in ID1 and ID2 and sorts them in the correct order for chat display
export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

// Pusher cannot utilize the colon ":" that Redis uses in it's database
// This is a global helper function we can use to convert the colon ":" to a double "__"
export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
