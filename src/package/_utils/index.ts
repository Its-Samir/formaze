import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function refactorFieldName(fieldName: string) {
	return fieldName[0].toUpperCase() + fieldName.slice(1);
}
