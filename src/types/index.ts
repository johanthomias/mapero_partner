export type Role = 'user' | 'partner' | 'admin';

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  subscriptionStatus: 'active' | 'inactive' | 'canceled';
  subscriptionRenewalDate?: string;
  badges: string[];
}

export interface PartnerUser {
  id: string;
  email: string;
  establishmentId: string;
  role: 'manager' | 'staff';
}

export interface AdminUser {
  id: string;
  email: string;
  permissions: string[];
}

export interface Establishment {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  openingHours: Record<string, { open: string; close: string }>;
  photos: string[];
  offers: Offer[];
  averageRating?: number;
  totalVisits?: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: string[];
  happyHourStart: string;
  happyHourEnd: string;
  badgeLabel?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'promotion' | 'tombola' | 'system';
  read: boolean;
}

export interface TombolaInfo {
  id: string;
  month: string;
  prizes: Array<{ id: string; title: string; description: string }>;
  drawDate: string;
  lastWinners: Array<{ id: string; name: string; prizeTitle: string }>;
  isAutoEnrollment: boolean;
}

export interface DashboardMetrics {
  activeSubscribers: number;
  totalRevenue: number;
  activePartners: number;
  offersRedeemed: number;
  upcomingDrawDate: string;
}
