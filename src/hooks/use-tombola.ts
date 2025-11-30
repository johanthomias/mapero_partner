import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TombolaInfo } from '@/types';

export function useTombola() {
  return useQuery({
    queryKey: ['tombola'],
    queryFn: async () => {
      const { data } = await api.get<TombolaInfo>('/tombola');
      return data;
    },
  });
}
