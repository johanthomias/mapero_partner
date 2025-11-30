import { useQuery } from '@tanstack/react-query';
import { establishmentApi } from '@/lib/api';
import type { Establishment } from '@/lib/types';

export function usePartnerEstablishment() {
  return useQuery({
    queryKey: ['partner-establishment'],
    queryFn: async () => {
      const data = await establishmentApi.getEstablishment();
      return data as Establishment | null;
    },
  });
}
