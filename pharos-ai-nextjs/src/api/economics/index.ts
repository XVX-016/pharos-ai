import { useQuery } from '@tanstack/react-query';
import type { EconomicIndex } from '@/types/domain';
import { api, buildUrl } from '../client';
import { queryKeys } from '../keys';

export interface EconFilters {
  tier?: number;
  category?: string;
}

export function useEconomicIndexes(filters?: EconFilters) {
  return useQuery({
    queryKey: queryKeys.economics.indexes(filters),
    queryFn: () =>
      api.get<EconomicIndex[]>(
        buildUrl('/economics/indexes', {
          tier: filters?.tier,
          category: filters?.category,
        }),
      ),
    staleTime: 60 * 60 * 1000,
  });
}
