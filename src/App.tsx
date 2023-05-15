import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, User } from './types.d'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const sortingComparisons = {
    [SortBy.COUNTRY]: (a: User, b: User) =>
      a.location.country.localeCompare(b.location.country),
    [SortBy.NAME]: (a: User, b: User) =>
      a.name.first.localeCompare(b.name.first),
    [SortBy.LAST]: (a: User, b: User) => a.name.last.localeCompare(b.name.last)
  }

  useEffect(() => {
    try {
      const getRandomUser = async () => {
        const response = await fetch('https://randomuser.me/api/?results=10')
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

  const changeSorting = (newSorting: SortBy) => {
    if (newSorting !== sorting) {
      return setSorting(newSorting)
    }
    setSorting(SortBy.NONE)
  }

  const filteredUsers = useMemo(() => {
    if (!search) return users
    return users.filter((user) =>
      user.location.country.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, users])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers
    return filteredUsers.toSorted(sortingComparisons[sorting])
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={() => changeSorting(SortBy.COUNTRY)}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por país'
            : 'Ordenar por País'}
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
          changeSorting={changeSorting}
        />
      </main>
    </>
  )
}

export default App
