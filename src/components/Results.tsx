import { useUsers } from '../hooks/useUsers'

export function Results() {
  const { users } = useUsers()
  return <h2>Resultados: {users.length}</h2>
}
