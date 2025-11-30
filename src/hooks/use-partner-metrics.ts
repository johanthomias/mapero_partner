import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import type { StatsOverview } from '@/lib/types';

export function usePartnerMetrics() {
  return useQuery({
    queryKey: ['partner-metrics'],
    queryFn: async () => {
      const { data } = await dashboardApi.getOverview();
      return data as StatsOverview;
    },
  });
}
