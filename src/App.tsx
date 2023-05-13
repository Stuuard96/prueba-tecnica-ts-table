import { useEffect, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { User } from './types'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [search, setSearch] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    try {
      const getRandomUser = async () => {
        const response = await fetch('https://randomuser.me/api/?results=100')
        const data = await response.json()
        setUsers(data.results)
        originalUsers.current = data.results
      }
      getRandomUser()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    setSortByCountry(!sortByCountry)
  }

  const filteredUsers =
    search && search.length > 0
      ? users.filter((user) =>
          user.location.country.toLowerCase().includes(search.toLowerCase())
        )
      : users

  const sortedUsers = sortByCountry
    ? filteredUsers.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    : filteredUsers

  return (
    <>
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? 'No ordenar por país' : 'Ordenar por País'}
        </button>
        <button onClick={handleReset}>Resetear estado</button>
        <input
          type="search"
          placeholder="Filtrar por país"
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      <main>
        <UsersList
          users={sortedUsers}
          deleteUser={handleDelete}
          showColors={showColors}
        />
      </main>
    </>
  )
}

export default App
