import { useQuery } from '@tanstack/react-query';
import { establishmentApi } from '@/lib/api';

export function usePartnerEstablishment() {
  return useQuery({
    queryKey: ['partner-establishment'],
    queryFn: () => establishmentApi.getEstablishment(),
  });
}
