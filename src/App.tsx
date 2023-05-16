import { useMemo, useState } from 'react'
import { UsersList } from './components/UsersList'
import { SortBy, User } from './types.d'
import { Spinner } from './components/Spinner'
import { useUsers } from './hooks/useUsers'
import './App.css'

function App() {
  const {
    users,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useUsers()

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string | null>(null)

  // const handleDelete = (uuid: string) => {
  //   const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
  //   setUsers(filteredUsers)
  // }

  const handleReset = () => {
    refetch()
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
              // deleteUser={handleDelete}
              showColors={showColors}
              changeSorting={changeSorting}
            />
            {isFetchingNextPage && <Spinner />}
            {!isFetchingNextPage && hasNextPage && (
              <button onClick={() => fetchNextPage()}>
                Cargar más usuarios
              </button>
            )}
          </>
        )}
        {isLoading && <Spinner />}
        {/* {isError && <p>{`An error has occurred: ${error.message}`}</p>} */}
        {!isLoading && !error && !users.length && <p>No hay usuarios</p>}
      </main>
    </>
  )
}

export default App
