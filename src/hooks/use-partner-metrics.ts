import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export function usePartnerMetrics() {
  return useQuery({
    queryKey: ['partner-metrics'],
    queryFn: () => dashboardApi.getOverview(),
  });
}
