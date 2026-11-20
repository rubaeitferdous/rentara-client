export type Role = "customer" | "owner" | "admin";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: "pending" | "approved" | "rejected";
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  ownerName: string;
  ownerEmail: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  bookingStatus: "confirmed" | "completed" | "cancelled";
  sessionId: string;
  createdAt: string;
  completedAt?: string;
}

export interface Paged<T> {
  equipment?: T[];
  items?: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CategoryInfo {
  name: string;
  description: string;
  iconName: string;
  count?: string;
}

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  phone?: string;
  address?: string;
  createdAt: string;
  roleUpdatedAt?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  monthly: Array<{ month: string; bookings: number; revenue: number }>;
}

export interface OwnerAnalytics {
  totalEquipment: number;
  totalBookings: number;
  completedRentals: number;
  totalEarnings: number;
  monthly: Array<{ month: string; earnings: number; bookings: number }>;
}

