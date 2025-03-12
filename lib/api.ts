import { authService } from "@/lib/auth";
import dotenv from "dotenv";
import { number } from "zod";

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

  //GAMBIARRA PARA CONTORNAR FALTA DE JSON NA RESPONSE
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
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

  getUsers: (page: number, size: number, name: string) =>
    fetchWithAuth(
      `/users?page=${page}&size=${size}&param=${encodeURIComponent(name)}`,
      {
        method: "GET",
      }
    ),

  updateUser: (data: Partial<User>) =>
    fetchWithAuth("/users", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUser: (idUser: string) =>
    fetchWithAuth(`/users/${idUser}`, {
      method: "DELETE",
    }),

  assignRole: (data: Role[], userId: string) =>
    fetchWithAuth(`/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  unassignRole: (data: Role[], userId: string) =>
    fetchWithAuth(`/users/${userId}/roles`, {
      method: "DELETE",
      body: JSON.stringify(data),
    }),

  // Status
  getStatuses: () => fetchWithAuth("/statuses"),

  createStatus: (data: Partial<Status>) =>
    fetchWithAuth("/statuses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (data: Status) =>
    fetchWithAuth("/statuses", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteStatus: (statusId: string) =>
    fetchWithAuth(`/statuses/${statusId}`, {
      method: "DELETE",
    }),

  //Categories
  getCategories: () => fetchWithAuth("/commitment-categories"),

  createCategory: (data: Partial<CommitmentCategory>) =>
    fetchWithAuth(`/commitment-categories`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (data: Partial<CommitmentCategory>) =>
    fetchWithAuth(`/commitment-categories`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (categoryId: string) =>
    fetchWithAuth(`/commitment-categories/${categoryId}`, {
      method: "DELETE",
    }),

  //Roles

  getRoles: (page: number, size: number, userId?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (userId) params.append("userId", userId);

    return fetchWithAuth(`/roles?${params.toString()}`);
  },

  createRole: (data: Partial<Role>) =>
    fetchWithAuth("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateRole: (data: Partial<Role>) =>
    fetchWithAuth("/roles", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteRole: (roleId: string) =>
    fetchWithAuth(`/roles/${roleId}`, {
      method: "DELETE",
    }),

  //Notifications
  
  getNotifications: (commitmentId: string, page: number, size: number) => {
    const params = new URLSearchParams({
      commitmentId: String(commitmentId),
      page: String(page),
      size: String(size)
    });
    
    return fetchWithAuth(`/notifications?${params.toString()}`);
  },

  createNotification: (data: Partial<Notification>) => 
    fetchWithAuth("/notifications", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateNotification: (data: Partial<Notification>) =>
    fetchWithAuth("/notifications", {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteNotification: (notificationId: string) => 
    fetchWithAuth(`/notifications/${notificationId}`, {
      method: "DELETE"
    }),

  //Report

  createReport: (reportRequestBody: ReportRequestBody) =>
    fetchWithAuth("/users/report", {
      method: "POST",
      body: JSON.stringify(reportRequestBody)
    }),

  //NotificationsGuests

  createNotificationInvitation: (notificationInvitation: Partial<NotificationInvitation>) =>
    fetchWithAuth("/guest/notifications", {
      method: "POST",
      body: JSON.stringify(notificationInvitation)
    }),
  
  getAllNotificationInvitations: (page: number, size: number, userId?: string,  statusId?: string, notificationId?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (statusId) params.append("statusId", statusId);
    if (userId) params.append("userId", userId);
    if (notificationId) params.append("notificationId", notificationId);

    return fetchWithAuth(`/guest/notifications?${params.toString()}`);
  },

  getNotificationInvitationById: (inviteId: string) =>
    fetchWithAuth(`/guest/notifications/${inviteId}`, {
      method: "GET"
    }),
  
  deleteNotificationInvitation: (inviteId: string) =>
    fetchWithAuth(`/guest/notifications/${inviteId}`, {
      method: "DELETE"
    }),

  updateNotificationInvitation: (notificationInvitation: Partial<NotificationInvitation>) => 
    fetchWithAuth("/guest/notifications", {
      method: "PUT",
      body: JSON.stringify(notificationInvitation)
    })

};
