import axios, { type AxiosRequestConfig } from 'axios';
import {
  type ApiListResponse,
  type ApiSuccessResponse,
  type AuthResponse,
  type Establishment,
  type LoginPayload,
  type Offer,
  type RegisterPayload,
  type StatsOverview,
} from './types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  withCredentials: true,
});

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

const generateId = (prefix: string) =>
  `${prefix}_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`;

interface MockDatabase {
  user: AuthResponse['user'];
  tokens: AuthResponse['tokens'];
  establishment: Establishment | null;
  offers: Offer[];
  stats: StatsOverview;
}

const initialEstablishment: Establishment = {
  id: 'est_001',
  name: 'Le Comptoir Mapéro',
  description:
    'Bar à vins & tapas convivial spécialisé dans les sélections locales et les accords apéritifs.',
  phone: '+33 1 42 00 00 00',
  email: 'contact@comptoirmapero.fr',
  address: {
    line1: '12 rue des Apéros',
    line2: 'Quartier Oberkampf',
    postalCode: '75011',
    city: 'Paris',
    country: 'France',
  },
  openingHours: [
    { day: 'monday', slots: [{ open: '17:00', close: '23:30' }] },
    { day: 'tuesday', slots: [{ open: '17:00', close: '23:30' }] },
    {
      day: 'wednesday',
      slots: [
        { open: '12:00', close: '14:30' },
        { open: '17:00', close: '00:30' },
      ],
    },
    {
      day: 'thursday',
      slots: [
        { open: '12:00', close: '14:30' },
        { open: '17:00', close: '01:00' },
      ],
    },
    {
      day: 'friday',
      slots: [
        { open: '12:00', close: '14:30' },
        { open: '17:00', close: '02:00' },
      ],
    },
    { day: 'saturday', slots: [{ open: '15:00', close: '02:00' }] },
    { day: 'sunday', slots: [] },
  ],
  photos: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    'https://images.unsplash.com/photo-1437419764061-2473afe69fc2',
  ],
  createdAt: new Date('2023-01-12').toISOString(),
  updatedAt: new Date('2024-01-02').toISOString(),
};

const initialOffers: Offer[] = [
  {
    id: 'offer_001',
    establishmentId: initialEstablishment.id,
    title: '-30% sur les planches à partager',
    description: 'Réduction appliquée sur toutes les planches apéritives avant 20h.',
    type: 'percentage',
    percentage: 30,
    schedule: {
      days: ['wednesday', 'thursday', 'friday'],
      startTime: '17:00',
      endTime: '20:00',
    },
    validity: {
      startDate: new Date('2024-09-01').toISOString(),
      endDate: new Date('2024-12-31').toISOString(),
    },
    isActive: true,
    createdAt: new Date('2024-06-01').toISOString(),
    updatedAt: new Date('2024-08-15').toISOString(),
  },
  {
    id: 'offer_002',
    establishmentId: initialEstablishment.id,
    title: 'Happy hour cocktails signatures',
    description: 'Cocktails signatures à 9€ au lieu de 13€ sur le créneau Happy Hour.',
    type: 'happy-hour',
    happyHourPrice: 9,
    schedule: {
      days: ['tuesday', 'wednesday', 'thursday'],
      startTime: '18:00',
      endTime: '19:30',
    },
    validity: {
      startDate: new Date('2024-08-01').toISOString(),
      endDate: new Date('2024-10-15').toISOString(),
    },
    isActive: true,
    createdAt: new Date('2024-07-10').toISOString(),
    updatedAt: new Date('2024-08-10').toISOString(),
  },
  {
    id: 'offer_003',
    establishmentId: initialEstablishment.id,
    title: '1 verre de bulles offert',
    description: 'Un verre de bulles offert pour tout groupe de 4 personnes et plus.',
    type: 'special',
    specialText: '1 verre offert à l’arrivée du groupe',
    schedule: {
      days: ['friday', 'saturday'],
      startTime: '18:30',
      endTime: '22:00',
    },
    validity: {
      startDate: new Date('2024-09-15').toISOString(),
      endDate: new Date('2024-11-30').toISOString(),
    },
    isActive: false,
    createdAt: new Date('2024-08-20').toISOString(),
    updatedAt: new Date('2024-09-05').toISOString(),
  },
];

const mockDb: MockDatabase = {
  user: {
    id: 'partner_001',
    establishmentId: initialEstablishment.id,
    email: 'partner@mapero.fr',
    firstName: 'Julie',
    lastName: 'Morel',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    createdAt: new Date('2023-01-01').toISOString(),
  },
  tokens: { token: 'mock-token', refreshToken: 'mock-refresh' },
  establishment: initialEstablishment,
  offers: initialOffers,
  stats: {
    totalVisitors: 842,
    offersViewed: 1342,
    offersRedeemed: 376,
    activeOffers: initialOffers.filter((offer) => offer.isActive).length,
    visitorsTrend: [
      { label: 'L', value: 74 },
      { label: 'M', value: 96 },
      { label: 'M', value: 132 },
      { label: 'J', value: 160 },
      { label: 'V', value: 210 },
      { label: 'S', value: 118 },
      { label: 'D', value: 52 },
    ],
  },
};

const ensureAuthenticated = () => {
  if (!mockDb.tokens.token) {
    throw new Error('Session expirée, veuillez vous reconnecter.');
  }
};

async function mockRequest<T>(cb: () => T): Promise<T> {
  await delay();
  return clone(cb());
}

async function mockMutation<T>(cb: () => T, config?: AxiosRequestConfig): Promise<T> {
  await delay(config?.timeout ?? 300);
  return clone(cb());
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return mockMutation(() => {
      mockDb.user = {
        id: generateId('partner'),
        email: payload.email,
        establishmentId: mockDb.establishment?.id ?? generateId('est'),
        firstName: payload.firstName,
        lastName: payload.lastName,
        avatarUrl: undefined,
        createdAt: new Date().toISOString(),
      };
      mockDb.tokens = {
        token: generateId('token'),
        refreshToken: generateId('refresh'),
      };
      if (!mockDb.establishment) {
        mockDb.establishment = {
          ...initialEstablishment,
          id: mockDb.user.establishmentId,
          name: payload.establishmentName,
          email: payload.email,
        };
      }
      return { user: mockDb.user, tokens: mockDb.tokens };
    });
  },
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return mockRequest(() => {
      if (payload.email !== mockDb.user.email) {
        throw new Error('Identifiants incorrects');
      }
      mockDb.tokens = { token: generateId('token'), refreshToken: generateId('refresh') };
      return { user: mockDb.user, tokens: mockDb.tokens };
    });
  },
  async logout(): Promise<void> {
    return mockRequest(() => {
      mockDb.tokens = { token: '', refreshToken: '' };
    });
  },
  async me(): Promise<AuthResponse['user']> {
    ensureAuthenticated();
    return mockRequest(() => mockDb.user);
  },
};

export const establishmentApi = {
  async getEstablishment(): Promise<Establishment | null> {
    ensureAuthenticated();
    return mockRequest(() => mockDb.establishment);
  },
  async createEstablishment(
    payload: Omit<Establishment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Establishment> {
    ensureAuthenticated();
    return mockMutation(() => {
      mockDb.establishment = {
        ...payload,
        id: generateId('est'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockDb.establishment;
    });
  },
  async updateEstablishment(id: string, payload: Partial<Establishment>): Promise<Establishment> {
    ensureAuthenticated();
    if (!mockDb.establishment || mockDb.establishment.id !== id) {
      throw new Error('Établissement introuvable');
    }
    return mockMutation(() => {
      mockDb.establishment = {
        ...mockDb.establishment!,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      return mockDb.establishment!;
    });
  },
  async deleteEstablishment(id: string): Promise<void> {
    ensureAuthenticated();
    if (mockDb.establishment?.id === id) {
      mockDb.establishment = null;
    }
    await delay();
  },
};

export const offersApi = {
  async listOffers(): Promise<ApiListResponse<Offer>> {
    ensureAuthenticated();
    return mockRequest(() => ({
      data: mockDb.offers,
      total: mockDb.offers.length,
    }));
  },
  async createOffer(payload: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    ensureAuthenticated();
    return mockMutation(() => {
      const newOffer: Offer = {
        ...payload,
        id: generateId('offer'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.offers = [newOffer, ...mockDb.offers];
      mockDb.stats.activeOffers = mockDb.offers.filter((offer) => offer.isActive).length;
      return newOffer;
    });
  },
  async getOffer(id: string): Promise<Offer> {
    ensureAuthenticated();
    return mockRequest(() => {
      const offer = mockDb.offers.find((item) => item.id === id);
      if (!offer) {
        throw new Error('Offre introuvable');
      }
      return offer;
    });
  },
  async updateOffer(id: string, payload: Partial<Offer>): Promise<Offer> {
    ensureAuthenticated();
    return mockMutation(() => {
      const offerIndex = mockDb.offers.findIndex((offer) => offer.id === id);
      if (offerIndex === -1) {
        throw new Error('Offre introuvable');
      }
      const updated: Offer = {
        ...mockDb.offers[offerIndex],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      mockDb.offers[offerIndex] = updated;
      mockDb.stats.activeOffers = mockDb.offers.filter((offer) => offer.isActive).length;
      return updated;
    });
  },
  async deleteOffer(id: string): Promise<void> {
    ensureAuthenticated();
    return mockMutation(() => {
      mockDb.offers = mockDb.offers.filter((offer) => offer.id !== id);
      mockDb.stats.activeOffers = mockDb.offers.filter((offer) => offer.isActive).length;
    });
  },
};

export const dashboardApi = {
  async getOverview(): Promise<ApiSuccessResponse<StatsOverview>> {
    ensureAuthenticated();
    return mockRequest(() => ({
      data: mockDb.stats,
      message: 'OK',
    }));
  },
};
