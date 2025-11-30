import { useQuery } from '@tanstack/react-query';
import { offersApi } from '@/lib/api';
import type { Offer } from '@/lib/types';

export function usePartnerOffer(id?: string) {
  return useQuery({
    queryKey: ['partner-offer', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('Identifiant manquant');
      }
      return offersApi.getOffer(id) as Promise<Offer>;
    },
  });
}
