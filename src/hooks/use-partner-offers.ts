import { useQuery } from '@tanstack/react-query';
import { offersApi } from '@/lib/api';

export function usePartnerOffers() {
  return useQuery({
    queryKey: ['partner-offers'],
    queryFn: async () => {
      const response = await offersApi.listOffers();
      return response.data;
    },
  });
}
