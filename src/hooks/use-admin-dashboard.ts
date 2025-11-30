import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DashboardMetrics } from '@/types';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardMetrics>('/admin/metrics');
      return data;
    },
  });
}
