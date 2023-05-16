export async function fetchUsers({ pageParam = 1 }: { pageParam?: number }) {
  const response = await fetch(
    `https://randomuser.me/api/?results=10&seed=stuard&page=${pageParam}`
  )
  if (!response.ok) {
    throw new Error('Error fetching users')
  }
  const { results } = await response.json()
  const currentPage = pageParam
  const nextPage = currentPage + 1
  return {
    users: results,
    nextPage: nextPage > 5 ? undefined : nextPage
  }
}
