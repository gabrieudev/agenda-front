import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAuthenticatedUser() {
  const user = await api.getMe();

  return user;
}

export async function isAuthenticatedUserAdmin() {
  try {const user = await api.getMe();
  const userRoles = await api.getRoles(0, 20, user.id);

  return userRoles.find((role: any) => role.name === "ADMIN");} catch (error) {
    console.log(error);
    
  }
}
