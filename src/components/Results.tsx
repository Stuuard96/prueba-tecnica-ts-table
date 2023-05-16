import { User } from '../types.d'

interface Props {
  users: User[]
}

export function Results({ users }: Props) {
  const results = users.length
  return <h2>Resultados: {results}</h2>
}
