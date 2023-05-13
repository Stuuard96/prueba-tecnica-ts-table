import { useEffect, useState } from 'react'
import './App.css'
import { User } from './types'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [colorTable, setColorTable] = useState(false)

  useEffect(() => {
    try {
      const getRandomUser = async () => {
        const response = await fetch('https://randomuser.me/api/?results=100')
        const data = await response.json()
        setUsers(data.results)
      }
      getRandomUser()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleColor = () => {
    setColorTable(!colorTable)
  }

  return (
    <div>
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={handleColor}>Colorear filas</button>
        <button>Ordenar por país</button>
        <button>Resetear estado</button>
        <input type="search" placeholder="Filtrar por país" />
      </header>
      <main>
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
            {users.map((user: any) => (
              <tr key={user.login.uuid}>
                <td>
                  <img src={user.picture.thumbnail} alt={user.name.first} />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default App
