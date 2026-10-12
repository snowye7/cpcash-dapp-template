import { clsx as baseClsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function clsx(...inputs: ClassValue[]) {
    return twMerge(baseClsx(inputs))
}
