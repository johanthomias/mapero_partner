import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Establishment } from '@/types';

export function useBar(id: string | undefined) {
  return useQuery({
    queryKey: ['bar', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.get<Establishment>(`/bars/${id}`);
      return data;
    },
  });
}
