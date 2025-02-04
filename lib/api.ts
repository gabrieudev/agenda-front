import { authService } from "@/lib/auth";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const accessToken = authService.getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const api = {
  // Commitments
  getCommitments: (params: {
    userId?: string;
    page: number;
    size: number;
    statusId?: string;
    commitmentCategoryId?: string;
  }) => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.userId && { userId: params.userId }),
      ...(params.statusId && { statusId: params.statusId }),
      ...(params.commitmentCategoryId && {
        commitmentCategoryId: params.commitmentCategoryId,
      }),
    });

    return fetchWithAuth(`/commitments?${searchParams}`);
  },

  createCommitment: (data: Partial<Commitment>) =>
    fetchWithAuth("/commitments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCommitment: (data: Partial<Commitment>) =>
    fetchWithAuth(`/commitments`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCommitment: (id: string) =>
    fetchWithAuth(`/commitments/${id}`, {
      method: "DELETE",
    }),

  // Tasks
  getTasks: (commitmentId: string) =>
    fetchWithAuth(`/commitments/${commitmentId}/tasks`),

  createTask: (commitmentId: string, data: Partial<Task>) =>
    fetchWithAuth(`/commitments/${commitmentId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (commitmentId: string, data: Partial<Task>) =>
    fetchWithAuth(`/commitments/${commitmentId}/tasks`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTask: (commitmentId: string, taskId: string) =>
    fetchWithAuth(`/commitments/${commitmentId}/tasks/${taskId}`, {
      method: "DELETE",
    }),

  // Users
  getMe: () => fetchWithAuth("/users/me"),

  // Status and Categories
  getStatuses: () => fetchWithAuth("/statuses"),
  getCategories: () => fetchWithAuth("/commitment-categories"),
};
