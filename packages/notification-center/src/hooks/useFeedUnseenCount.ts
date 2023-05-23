import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { IStoreQuery } from '@novu/client';

import { useNovuContext } from './useNovuContext';
import { FEED_UNSEEN_COUNT_QUERY_KEY } from './queryKeys';
import type { ICountData } from '../shared/interfaces';

export const useFeedUnseenCount = (
  { query }: { query?: IStoreQuery },
  options: UseQueryOptions<ICountData, Error, ICountData> = {}
) => {
  const { apiService, isSessionInitialized, subscriberId } = useNovuContext();
  const unseenQuery = { ...query, seen: false };

  const result = useQuery<ICountData, Error, ICountData>(
    [...FEED_UNSEEN_COUNT_QUERY_KEY, unseenQuery, subscriberId],
    () => apiService.getTabCount(unseenQuery),
    {
      ...options,
      enabled: isSessionInitialized,
    }
  );

  return result;
};
