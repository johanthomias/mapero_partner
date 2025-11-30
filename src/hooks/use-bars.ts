import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Establishment } from '@/types';

export function useBars() {
  return useQuery({
    queryKey: ['bars'],
    queryFn: async () => {
      const { data } = await api.get<Establishment[]>('/bars');
      return data;
    },
  });
}
