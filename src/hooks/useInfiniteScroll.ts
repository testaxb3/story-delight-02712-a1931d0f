import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface UseInfiniteScrollOptions<TData, TError> extends Omit<UseInfiniteQueryOptions<TData, TError>, 'queryFn'> {
  queryFn: (pageParam: number) => Promise<TData[]>;
  enabled?: boolean;
}

export const useInfiniteScroll = <TData, TError = Error>(
  options: UseInfiniteScrollOptions<TData, TError>
) => {
  const { ref, inView } = useInView();

  const query = useInfiniteQuery({
    ...options,
    getNextPageParam: (lastPage, pages) => {
      // Se a última página tem menos de 20 itens, não há mais páginas
      if (lastPage.length < 20) {
        return undefined;
      }
      return pages.length;
    },
    initialPageParam: 0,
  });

  // Carregar próxima página quando o usuário scrollar até o fim
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

