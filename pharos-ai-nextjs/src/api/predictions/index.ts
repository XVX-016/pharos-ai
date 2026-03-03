import { useQuery } from '@tanstack/react-query';
import type { MarketGroup } from '@/types/domain';
import { api } from '../client';
import { queryKeys } from '../keys';

export function usePredictionGroups() {
  return useQuery({
    queryKey: queryKeys.predictions.groups(),
    queryFn: () => api.get<MarketGroup[]>('/predictions/groups'),
    staleTime: 60 * 60 * 1000,
  });
}
