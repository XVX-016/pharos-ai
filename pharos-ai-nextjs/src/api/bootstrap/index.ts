import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../keys';

export interface BootstrapData {
  conflictId: string;
  conflictName: string;
  days: string[];
  status: string;
  threatLevel: string;
  escalation: number;
}

export function useBootstrap() {
  return useQuery({
    queryKey: queryKeys.bootstrap.all(),
    queryFn: () => api.get<BootstrapData>('/bootstrap'),
    staleTime: 5 * 60 * 1000,
  });
}
