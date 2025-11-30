export type PartnerRole = 'partner';

export interface PartnerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  establishmentId: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: PartnerUser;
  tokens: AuthTokens;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  establishmentName: string;
  acceptTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface EstablishmentAddress {
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
}

export type OpeningSlot = {
  open: string;
  close: string;
};

export interface OpeningDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: OpeningSlot[];
}

export interface Establishment {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: EstablishmentAddress;
  openingHours: OpeningDay[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export type OfferType = 'percentage' | 'special' | 'happy-hour';

export interface OfferSchedule {
  days: OpeningDay['day'][];
  startTime: string;
  endTime: string;
}

export interface OfferValidity {
  startDate: string;
  endDate: string;
}

export interface Offer {
  id: string;
  establishmentId: string;
  title: string;
  description: string;
  type: OfferType;
  percentage?: number;
  specialText?: string;
  happyHourPrice?: number;
  schedule: OfferSchedule;
  validity: OfferValidity;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatsOverview {
  totalVisitors: number;
  offersViewed: number;
  offersRedeemed: number;
  activeOffers: number;
  visitorsTrend: Array<{ label: string; value: number }>;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}
