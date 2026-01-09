import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes with clsx and tailwind-merge to handle conflicts.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a 24-hour time string (HH:mm) or a Date object/ISO string 
 * to a user-friendly 12-hour format (h:mm AM/PM).
 */
export function formatTime12Hour(time: string | Date | undefined | null): string {
    if (!time) return "";
    
    let hours: number;
    let minutes: number;

    if (time instanceof Date) {
        hours = time.getHours();
        minutes = time.getMinutes();
    } else if (typeof time === "string") {
        // Handle ISO strings or HH:mm strings
        if (time.includes("T")) {
            const date = new Date(time);
            hours = date.getHours();
            minutes = date.getMinutes();
        } else {
            const parts = time.split(":");
            hours = parseInt(parts[0], 10);
            minutes = parseInt(parts[1], 10);
        }
    } else {
        return "";
    }

    if (isNaN(hours) || isNaN(minutes)) return "";

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");

    return `${displayHours}:${displayMinutes} ${period}`;
}