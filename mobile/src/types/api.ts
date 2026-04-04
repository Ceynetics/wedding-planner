// ---- Enums (match backend exactly) ----
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type GuestSide = 'BRIDE' | 'GROOM';
export type GuestStatus = 'PENDING' | 'CONFIRMED' | 'NOT_INVITED';
export type GuestCategory = 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'WORK' | 'CLUB';
export type AddressStyle = 'INDIVIDUAL' | 'COUPLE' | 'FAMILY';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskCategory = 'VENUE' | 'FOOD' | 'ATTIRE' | 'FLOWERS' | 'DECOR';
export type ExpenseCategory = 'FOOD' | 'CLOTHING' | 'DECOR' | 'VENUE' | 'PHOTOGRAPHY' | 'OTHER';
export type Payer = 'ME' | 'PARTNER';
export type TableShape = 'ROUND' | 'RECTANGULAR' | 'SQUARE' | 'OVAL' | 'U_SHAPE' | 'LONG' | 'HEAD_TABLE';
export type VendorCategory = 'VENUE' | 'PHOTOGRAPHY' | 'CATERING' | 'FLORIST' | 'DECOR' | 'MUSIC' | 'OTHER';
export type PaymentFrequency = 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL' | 'ANNUAL';
export type InvitationStatus = 'DRAFT' | 'GENERATED' | 'SENT';
export type ExportFormat = 'PDF' | 'JPEG';
export type WorkspaceRole = 'OWNER' | 'PARTNER' | 'PLANNER';
export type NotificationType = 'PAYMENT' | 'RSVP' | 'ALERT' | 'TASK' | 'PROMOTION' | 'EVENT' | 'SYSTEM';
export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type FileFolder = 'CONTRACTS' | 'INVOICES' | 'INVITATIONS' | 'OTHER';

// ---- Response types ----
export interface UserResponse {
  id: number;
  fullName: string;
  age?: number;
  gender?: Gender;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface WorkspaceMember {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface WorkspaceResponse {
  id: number;
  eventName: string;
  eventDate?: string;
  venue?: string;
  budget?: number;
  pairingCode?: string;
  members?: WorkspaceMember[];
}

export interface GuestResponse {
  id: number;
  name: string;
  title?: string;
  avatarUrl?: string;
  side: GuestSide;
  status: GuestStatus;
  category?: GuestCategory;
  phone?: string;
  email?: string;
  adults?: number;
  children?: number;
  dietary?: string;
  isVip: boolean;
  isHeadOfHousehold: boolean;
  notes?: string;
  householdId?: number;
  householdName?: string;
}

export interface GuestStatsResponse {
  total: number;
  confirmed: number;
  pending: number;
  notInvited: number;
  vipCount: number;
  totalAdults: number;
  totalChildren: number;
  totalHouseholds: number;
}

export interface RsvpSummary {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
}

export interface HouseholdResponse {
  id: number;
  householdName: string;
  formalAddress?: string;
  addressStyle: AddressStyle;
  headGuestId?: number;
  assignedTableId?: number;
  assignedTableName?: string;
  rsvpSummary?: RsvpSummary;
  members?: GuestResponse[];
  totalMembers?: number;
}

export interface AssignedUser {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  dueDate?: string;
  category?: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
  notes?: string;
  assignedUsers?: AssignedUser[];
}

export interface TaskStatsResponse {
  total: number;
  completed: number;
  pending: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface ExpenseResponse {
  id: number;
  title: string;
  amount: number;
  category?: ExpenseCategory;
  paidBy?: Payer;
  isPaid: boolean;
  splitEnabled: boolean;
  notes?: string;
  date?: string;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface BudgetSummaryResponse {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  paidCount: number;
  unpaidCount: number;
  byCategory: CategoryBreakdown[];
}

export interface SeatingTableResponse {
  id: number;
  name: string;
  tableShape?: TableShape;
  chairCount?: number;
  positionX?: number;
  positionY?: number;
  rotation?: number;
  isVip: boolean;
  seatedCount: number;
  householdCount: number;
  households?: HouseholdResponse[];
}

export interface SeatingStatsResponse {
  totalTables: number;
  totalChairs: number;
  filledChairs: number;
  emptyChairs: number;
  assignedHouseholds: number;
  unassignedHouseholds: number;
}

export interface VendorResponse {
  id: number;
  name: string;
  category?: VendorCategory;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  price?: number;
  description?: string;
  address?: string;
  email?: string;
  phone?: string;
  services?: string[];
}

export interface HiredVendorResponse {
  id: number;
  vendorName: string;
  companyName?: string;
  category?: VendorCategory;
  address?: string;
  email?: string;
  phone?: string;
  totalAmount?: number;
  paidAmount?: number;
  notes?: string;
  reminderEnabled: boolean;
  frequency?: PaymentFrequency;
  dueDate?: string;
  vendorId?: number;
}

export interface InvitationResponse {
  id: number;
  templateId?: string;
  name1?: string;
  name2?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  selectedColor?: string;
  greeting?: string;
  addressLine?: string;
  isVipGuest: boolean;
  status?: InvitationStatus;
  householdId?: number;
  householdName?: string;
  hasPdf: boolean;
  hasJpeg: boolean;
}

export interface TemplateResponse {
  id: string;
  displayName: string;
  description: string;
}

export interface NotificationResponse {
  id: number;
  title: string;
  description?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  actionUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CalendarEventResponse {
  date: string;
  title: string;
  type: string;
  referenceId?: number;
  status?: string;
  amount?: string;
}

export interface FileResponse {
  id: number;
  name: string;
  module?: string;
  size?: number;
  folder: FileFolder;
  contentType?: string;
  createdAt?: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

// ---- Request types ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  age?: number;
  gender?: Gender;
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface WorkspaceRequest {
  eventName: string;
  eventDate?: string;
  venue?: string;
  budget?: number;
}

export interface GuestRequest {
  name: string;
  title?: string;
  side: GuestSide;
  status?: GuestStatus;
  category?: GuestCategory;
  phone?: string;
  email?: string;
  adults?: number;
  children?: number;
  dietary?: string;
  isVip?: boolean;
  isHeadOfHousehold?: boolean;
  notes?: string;
  householdId?: number;
  newHouseholdStyle?: AddressStyle;
  householdName?: string;
  formalAddress?: string;
}

export interface HouseholdRequest {
  householdName: string;
  formalAddress?: string;
  addressStyle: AddressStyle;
}

export interface TaskRequest {
  title: string;
  dueDate?: string;
  category?: TaskCategory;
  priority: TaskPriority;
  isCompleted?: boolean;
  notes?: string;
  assignedUserIds?: number[];
}

export interface ExpenseRequest {
  title: string;
  amount: number;
  category?: ExpenseCategory;
  paidBy?: Payer;
  isPaid?: boolean;
  splitEnabled?: boolean;
  notes?: string;
  date?: string;
}

export interface SeatingTableRequest {
  name: string;
  tableShape?: TableShape;
  chairCount?: number;
  isVip?: boolean;
}

export interface PositionUpdateRequest {
  positionX?: number;
  positionY?: number;
  rotation?: number;
}

export interface HiredVendorRequest {
  vendorName: string;
  companyName?: string;
  category?: VendorCategory;
  address?: string;
  email?: string;
  phone?: string;
  totalAmount?: number;
  paidAmount?: number;
  notes?: string;
  reminderEnabled?: boolean;
  frequency?: PaymentFrequency;
  dueDate?: string;
  vendorId?: number;
}

export interface InvitationRequest {
  templateId?: string;
  name1?: string;
  name2?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  selectedColor?: string;
  greeting?: string;
  addressLine?: string;
  isVipGuest?: boolean;
  householdId?: number;
}

export interface InviteRequest {
  email: string;
  role?: WorkspaceRole;
}

export interface JoinRequest {
  pairingCode: string;
}
