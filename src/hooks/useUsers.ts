import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchUsers } from '../services/fetchUsers'
import { User } from '../types.d'

export function useUsers() {
  const {
    isLoading,
    isError,
    error,
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useInfiniteQuery<{
    users: User
    nextPage: number | undefined
  }>(['users'], fetchUsers, {
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  return {
    isLoading,
    isError,
    error,
    users: data?.pages.flatMap((page) => page.users) ?? [],
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  }
}
