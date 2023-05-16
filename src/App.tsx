import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, User } from './types.d'
import { Spinner } from './components/Spinner'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const originalUsers = useRef<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const getRandomUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `https://randomuser.me/api/?results=10&seed=stuar&page=${currentPage}`
        )
        if (!response.ok) {
          throw new Error('Error fetching users')
        }
        const data = await response.json()
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(data.results)
          originalUsers.current = newUsers
          return newUsers
        })
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getRandomUser()
  }, [currentPage])

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setCurrentPage((prevPage) => prevPage + 1)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    const sortingComparisons = {
      [SortBy.COUNTRY]: (a: User, b: User) =>
        a.location.country.localeCompare(b.location.country),
      [SortBy.NAME]: (a: User, b: User) =>
        a.name.first.localeCompare(b.name.first),
      [SortBy.LAST]: (a: User, b: User) =>
        a.name.last.localeCompare(b.name.last)
    }

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
        {users.length > 0 && (
          <>
            <UsersList
              users={sortedUsers}
              deleteUser={handleDelete}
              showColors={showColors}
              changeSorting={changeSorting}
            />
          </>
        )}
        {loading && <Spinner />}
        {error && <p>{error}</p>}
        {!loading && !error && !users.length && <p>No hay usuarios</p>}
      </main>
    </>
  )
}

export default App
