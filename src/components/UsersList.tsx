import { SortBy, User } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (uuid: string) => void
  changeSorting: (newSorting: SortBy) => void
}

export function UsersList({
  users,
  showColors,
  deleteUser,
  changeSorting
}: Props) {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Foto</th>
          <th
            className="pointer"
            onClick={() => {
              changeSorting(SortBy.NAME)
            }}
          >
            Nombre
          </th>
          <th
            className="pointer"
            onClick={() => {
              changeSorting(SortBy.LAST)
            }}
          >
            Apellido
          </th>
          <th
            className="pointer"
            onClick={() => {
              changeSorting(SortBy.COUNTRY)
            }}
          >
            País
          </th>
          <th>Accciones</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'showColorTable' : ''}>
        {users.map((user) => {
          return (
            <tr key={user.login.uuid}>
              <td>
                <img src={user.picture.thumbnail} alt={user.name.first} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUser(user.login.uuid)}>
                  Borrar
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
