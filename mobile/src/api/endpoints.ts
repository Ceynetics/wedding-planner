import client from './client';
import type {
  AuthResponse, UserResponse, ProfileUpdateRequest, LoginRequest, RegisterRequest,
  WorkspaceResponse, WorkspaceRequest, InviteRequest, JoinRequest,
  GuestResponse, GuestRequest, GuestStatsResponse,
  HouseholdResponse, HouseholdRequest,
  TaskResponse, TaskRequest, TaskStatsResponse,
  ExpenseResponse, ExpenseRequest, BudgetSummaryResponse,
  SeatingTableResponse, SeatingTableRequest, PositionUpdateRequest, SeatingStatsResponse,
  VendorResponse, HiredVendorResponse, HiredVendorRequest,
  InvitationResponse, InvitationRequest, TemplateResponse,
  NotificationResponse, CalendarEventResponse, FileResponse,
  ExportFormat, NotificationType, NotificationPriority,
  GuestStatus, GuestSide, GuestCategory, HouseholdResponse as HouseholdResp,
} from '@/types/api';

export const authApi = {
  login: (data: LoginRequest) => client.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterRequest) => client.post<AuthResponse>('/api/auth/register', data),
  refresh: (refreshToken: string) => client.post<AuthResponse>('/api/auth/refresh', { refreshToken }),
  me: () => client.get<UserResponse>('/api/auth/me'),
  updateProfile: (data: ProfileUpdateRequest) => client.put<UserResponse>('/api/auth/profile', data),
};

export const workspaceApi = {
  create: (data: WorkspaceRequest) => client.post<WorkspaceResponse>('/api/workspaces', data),
  list: () => client.get<WorkspaceResponse[]>('/api/workspaces'),
  getById: (id: number) => client.get<WorkspaceResponse>(`/api/workspaces/${id}`),
  update: (id: number, data: WorkspaceRequest) => client.put<WorkspaceResponse>(`/api/workspaces/${id}`, data),
  invite: (id: number, data: InviteRequest) => client.post<void>(`/api/workspaces/${id}/invite`, data),
  join: (data: JoinRequest) => client.post<WorkspaceResponse>('/api/workspaces/join', data),
};

export const guestApi = {
  list: (wid: number, params?: { status?: string; side?: string; category?: string; householdId?: number; search?: string }) =>
    client.get<GuestResponse[]>(`/api/workspaces/${wid}/guests`, { params }),
  getById: (wid: number, id: number) => client.get<GuestResponse>(`/api/workspaces/${wid}/guests/${id}`),
  create: (wid: number, data: GuestRequest) => client.post<GuestResponse>(`/api/workspaces/${wid}/guests`, data),
  update: (wid: number, id: number, data: GuestRequest) => client.put<GuestResponse>(`/api/workspaces/${wid}/guests/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/guests/${id}`),
  stats: (wid: number) => client.get<GuestStatsResponse>(`/api/workspaces/${wid}/guests/stats`),
};

export const householdApi = {
  list: (wid: number) => client.get<HouseholdResponse[]>(`/api/workspaces/${wid}/households`),
  getById: (wid: number, id: number) => client.get<HouseholdResponse>(`/api/workspaces/${wid}/households/${id}`),
  create: (wid: number, data: HouseholdRequest) => client.post<HouseholdResponse>(`/api/workspaces/${wid}/households`, data),
  update: (wid: number, id: number, data: HouseholdRequest) => client.put<HouseholdResponse>(`/api/workspaces/${wid}/households/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/households/${id}`),
  unassigned: (wid: number) => client.get<HouseholdResponse[]>(`/api/workspaces/${wid}/households/unassigned`),
};

export const taskApi = {
  list: (wid: number, params?: { completed?: boolean; category?: string; priority?: string }) =>
    client.get<TaskResponse[]>(`/api/workspaces/${wid}/tasks`, { params }),
  getById: (wid: number, id: number) => client.get<TaskResponse>(`/api/workspaces/${wid}/tasks/${id}`),
  create: (wid: number, data: TaskRequest) => client.post<TaskResponse>(`/api/workspaces/${wid}/tasks`, data),
  update: (wid: number, id: number, data: TaskRequest) => client.put<TaskResponse>(`/api/workspaces/${wid}/tasks/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/tasks/${id}`),
  toggle: (wid: number, id: number) => client.patch<TaskResponse>(`/api/workspaces/${wid}/tasks/${id}/toggle`),
  stats: (wid: number) => client.get<TaskStatsResponse>(`/api/workspaces/${wid}/tasks/stats`),
};

export const expenseApi = {
  list: (wid: number) => client.get<ExpenseResponse[]>(`/api/workspaces/${wid}/expenses`),
  getById: (wid: number, id: number) => client.get<ExpenseResponse>(`/api/workspaces/${wid}/expenses/${id}`),
  create: (wid: number, data: ExpenseRequest) => client.post<ExpenseResponse>(`/api/workspaces/${wid}/expenses`, data),
  update: (wid: number, id: number, data: ExpenseRequest) => client.put<ExpenseResponse>(`/api/workspaces/${wid}/expenses/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/expenses/${id}`),
  summary: (wid: number) => client.get<BudgetSummaryResponse>(`/api/workspaces/${wid}/expenses/summary`),
};

export const seatingTableApi = {
  list: (wid: number) => client.get<SeatingTableResponse[]>(`/api/workspaces/${wid}/seating-tables`),
  getById: (wid: number, id: number) => client.get<SeatingTableResponse>(`/api/workspaces/${wid}/seating-tables/${id}`),
  create: (wid: number, data: SeatingTableRequest) => client.post<SeatingTableResponse>(`/api/workspaces/${wid}/seating-tables`, data),
  update: (wid: number, id: number, data: SeatingTableRequest) => client.put<SeatingTableResponse>(`/api/workspaces/${wid}/seating-tables/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/seating-tables/${id}`),
  updatePosition: (wid: number, id: number, data: PositionUpdateRequest) =>
    client.patch<SeatingTableResponse>(`/api/workspaces/${wid}/seating-tables/${id}/position`, data),
  assignHouseholds: (wid: number, id: number, householdIds: number[]) =>
    client.post<SeatingTableResponse>(`/api/workspaces/${wid}/seating-tables/${id}/households`, { householdIds }),
  unassignHousehold: (wid: number, tableId: number, householdId: number) =>
    client.delete<void>(`/api/workspaces/${wid}/seating-tables/${tableId}/households/${householdId}`),
  unassignedHouseholds: (wid: number) =>
    client.get<HouseholdResp[]>(`/api/workspaces/${wid}/seating-tables/unassigned-households`),
  stats: (wid: number) => client.get<SeatingStatsResponse>(`/api/workspaces/${wid}/seating-tables/stats`),
};

export const vendorApi = {
  list: (params?: { category?: string; search?: string; page?: number; size?: number }) =>
    client.get<{ content: VendorResponse[]; totalPages: number; totalElements: number }>('/api/vendors', { params }),
  getById: (id: number) => client.get<VendorResponse>(`/api/vendors/${id}`),
};

export const hiredVendorApi = {
  list: (wid: number) => client.get<HiredVendorResponse[]>(`/api/workspaces/${wid}/vendors`),
  getById: (wid: number, id: number) => client.get<HiredVendorResponse>(`/api/workspaces/${wid}/vendors/${id}`),
  create: (wid: number, data: HiredVendorRequest) => client.post<HiredVendorResponse>(`/api/workspaces/${wid}/vendors`, data),
  update: (wid: number, id: number, data: HiredVendorRequest) => client.put<HiredVendorResponse>(`/api/workspaces/${wid}/vendors/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/vendors/${id}`),
};

export const invitationApi = {
  list: (wid: number) => client.get<InvitationResponse[]>(`/api/workspaces/${wid}/invitations`),
  getById: (wid: number, id: number) => client.get<InvitationResponse>(`/api/workspaces/${wid}/invitations/${id}`),
  create: (wid: number, data: InvitationRequest) => client.post<InvitationResponse>(`/api/workspaces/${wid}/invitations`, data),
  update: (wid: number, id: number, data: InvitationRequest) => client.put<InvitationResponse>(`/api/workspaces/${wid}/invitations/${id}`, data),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/invitations/${id}`),
  generate: (wid: number, id: number, format: ExportFormat = 'PDF') =>
    client.post<InvitationResponse>(`/api/workspaces/${wid}/invitations/${id}/generate`, null, { params: { format } }),
  generateBatch: (wid: number, templateId?: string, format: ExportFormat = 'PDF') =>
    client.post<void>(`/api/workspaces/${wid}/invitations/generate-batch`, null, { params: { templateId, format } }),
  download: (wid: number, id: number, format: ExportFormat = 'PDF') =>
    client.get<Blob>(`/api/workspaces/${wid}/invitations/${id}/download`, { params: { format }, responseType: 'blob' }),
  templates: (wid: number) => client.get<TemplateResponse[]>(`/api/workspaces/${wid}/invitations/templates`),
};

export const notificationApi = {
  list: (wid: number, params?: { type?: NotificationType; priority?: NotificationPriority }) =>
    client.get<NotificationResponse[]>(`/api/workspaces/${wid}/notifications`, { params }),
  markAsRead: (wid: number, id: number) =>
    client.patch<NotificationResponse>(`/api/workspaces/${wid}/notifications/${id}/read`),
  markAllAsRead: (wid: number) => client.patch<void>(`/api/workspaces/${wid}/notifications/read-all`),
  unreadCount: (wid: number) => client.get<{ count: number }>(`/api/workspaces/${wid}/notifications/unread-count`),
};

export const calendarApi = {
  getEvents: (wid: number, month: string) =>
    client.get<CalendarEventResponse[]>(`/api/workspaces/${wid}/calendar`, { params: { month } }),
};

export const fileApi = {
  list: (wid: number, folder?: string) =>
    client.get<FileResponse[]>(`/api/workspaces/${wid}/files`, { params: folder ? { folder } : undefined }),
  upload: (wid: number, formData: FormData) =>
    client.post<FileResponse>(`/api/workspaces/${wid}/files`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  download: (wid: number, id: number) =>
    client.get<Blob>(`/api/workspaces/${wid}/files/${id}/download`, { responseType: 'blob' }),
  delete: (wid: number, id: number) => client.delete<void>(`/api/workspaces/${wid}/files/${id}`),
};

export const deviceApi = {
  register: (data: { fcmToken: string; deviceType: string; deviceName?: string }) =>
    client.post<void>('/api/devices', data),
  unregister: (token: string) => client.delete<void>(`/api/devices/${token}`),
};
