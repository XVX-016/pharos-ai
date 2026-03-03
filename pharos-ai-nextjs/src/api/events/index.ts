import { useQuery } from '@tanstack/react-query';
import type { IntelEvent } from '@/types/domain';
import { api, buildUrl } from '../client';
import { queryKeys } from '../keys';

const CONFLICT_ID = process.env.NEXT_PUBLIC_CONFLICT_ID!;

export interface EventFilters {
  day?: string;
  severity?: string;
  type?: string;
  verified?: boolean;
}

export function useEvents(id: string = CONFLICT_ID, filters?: EventFilters) {
  return useQuery({
    queryKey: queryKeys.events.list(id, filters),
    queryFn: () =>
      api.get<IntelEvent[]>(
        buildUrl(`/conflicts/${id}/events`, {
          day: filters?.day,
          severity: filters?.severity,
          type: filters?.type,
          verified: filters?.verified,
        }),
      ),
    staleTime: 60_000,
  });
}

export function useEvent(id: string = CONFLICT_ID, eventId?: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id, eventId),
    queryFn: () => api.get<IntelEvent>(`/conflicts/${id}/events/${eventId}`),
    enabled: !!eventId,
    staleTime: 60_000,
  });
}
