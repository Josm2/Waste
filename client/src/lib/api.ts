import { apiRequest } from "./queryClient";

export const api = {
  // Dashboard
  getDashboardStats: () => fetch("/api/dashboard/stats").then(res => res.json()),

  // Waste Reports
  getWasteReports: () => fetch("/api/waste-reports").then(res => res.json()),
  createWasteReport: (data: FormData) => apiRequest("POST", "/api/waste-reports", data),
  updateWasteReport: (id: number, data: any) => apiRequest("PATCH", `/api/waste-reports/${id}`, data),

  // Collection Schedules
  getCollectionSchedules: () => fetch("/api/collection-schedules").then(res => res.json()),
  createCollectionSchedule: (data: any) => apiRequest("POST", "/api/collection-schedules", data),
  updateCollectionSchedule: (id: number, data: any) => apiRequest("PATCH", `/api/collection-schedules/${id}`, data),

  // Routes
  getRoutes: () => fetch("/api/routes").then(res => res.json()),
  createRoute: (data: any) => apiRequest("POST", "/api/routes", data),

  // Educational Content
  getEducationalContent: () => fetch("/api/educational-content").then(res => res.json()),
  createEducationalContent: (data: any) => apiRequest("POST", "/api/educational-content", data),
  updateEducationalContent: (id: number, data: any) => apiRequest("PATCH", `/api/educational-content/${id}`, data),

  // Residents
  getResidents: () => fetch("/api/residents").then(res => res.json()),
  createResident: (data: any) => apiRequest("POST", "/api/residents", data),

  // Notifications
  getNotifications: () => fetch("/api/notifications").then(res => res.json()),
  createNotification: (data: any) => apiRequest("POST", "/api/notifications", data),
};
