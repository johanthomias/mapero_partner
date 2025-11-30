import axios, { type AxiosResponse } from 'axios';
import type {
  ApiSuccessResponse,
  AuthResponse,
  Establishment,
  LoginPayload,
  Offer,
  RegisterPayload,
  StatsOverview,
} from './types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/',
  withCredentials: true,
});

type Envelope<T> = ApiSuccessResponse<T>;

async function unwrap<T>(promise: Promise<AxiosResponse<Envelope<T>>>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    unwrap<AuthResponse>(api.post<Envelope<AuthResponse>>('/auth/register', payload)),
  login: (payload: LoginPayload) =>
    unwrap<AuthResponse>(api.post<Envelope<AuthResponse>>('/auth/login', payload)),
  logout: () => unwrap<null>(api.post<Envelope<null>>('/auth/logout', {})),
  me: () => unwrap<AuthResponse['user']>(api.get<Envelope<AuthResponse['user']>>('/auth/me')),
};

export type EstablishmentPayload = Omit<Establishment, 'id' | 'createdAt' | 'updatedAt'>;

export const establishmentApi = {
  getEstablishment: () =>
    unwrap<Establishment>(api.get<Envelope<Establishment>>('/partner/establishment')),
  updateEstablishment: (payload: EstablishmentPayload) =>
    unwrap<Establishment>(api.put<Envelope<Establishment>>('/partner/establishment', payload)),
};

export type OfferPayload = Omit<Offer, 'id' | 'establishmentId' | 'createdAt' | 'updatedAt'>;

export const offersApi = {
  listOffers: () => unwrap<Offer[]>(api.get<Envelope<Offer[]>>('/partner/offers')),
  createOffer: (payload: OfferPayload) =>
    unwrap<Offer>(api.post<Envelope<Offer>>('/partner/offers', payload)),
  getOffer: (id: string) => unwrap<Offer>(api.get<Envelope<Offer>>(`/partner/offers/${id}`)),
  updateOffer: (id: string, payload: OfferPayload) =>
    unwrap<Offer>(api.put<Envelope<Offer>>(`/partner/offers/${id}`, payload)),
  deleteOffer: (id: string) => unwrap<null>(api.delete<Envelope<null>>(`/partner/offers/${id}`)),
};

export const dashboardApi = {
  getOverview: () =>
    unwrap<StatsOverview>(api.get<Envelope<StatsOverview>>('/partner/stats/overview')),
};
