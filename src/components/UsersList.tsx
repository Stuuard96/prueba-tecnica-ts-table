import { User } from '../types'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (uuid: string) => void
}

export function UsersList({ users, showColors, deleteUser }: Props) {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>País</th>
          <th>Accciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => {
          const backgroundColor = idx % 2 === 0 ? '#333' : '#555'
          const color = showColors ? backgroundColor : 'transparent'
          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
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
