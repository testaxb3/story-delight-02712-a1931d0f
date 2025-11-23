// @ts-nocheck
import { useEffect } from 'react';
import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions<TData, TError> extends Omit<UseInfiniteQueryOptions<TData, TError>, 'queryFn'> {
  queryFn: (pageParam: number) => Promise<TData[]>;
  enabled?: boolean;
}

export const useInfiniteScroll = <TData, TError = Error>(
  options: UseInfiniteScrollOptions<TData, TError>
) => {
  const { ref, inView } = useInView();

  // @ts-ignore - TanStack Query v5 type compatibility
  const query = useInfiniteQuery({
    ...options,
    queryFn: ({ pageParam = 0 }) => options.queryFn(pageParam as number),
    getNextPageParam: (lastPage, pages) => {
      // If the last page has fewer than 20 items, there are no more pages
      if (lastPage.length < 20) {
        return undefined;
      }
      return pages.length;
    },
    initialPageParam: 0,
  });

  // Load next page when user scrolls to the end
  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query.hasNextPage, query.isFetchingNextPage, query]);

  return {
    ...query,
    ref,
    inView,
  };
};

