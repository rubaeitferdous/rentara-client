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
