import { useMemo, useState } from 'react'
import { UsersList } from './components/UsersList'
import { SortBy, User } from './types.d'
import { Spinner } from './components/Spinner'
import { useUsers } from './hooks/useUsers'
import './App.css'
import { Results } from './components/Results'

function App() {
  const {
    users,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useUsers()

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string | null>(null)

  const handleDelete = (uuid: string) => {
    // Metodo para eliminar usuarios de la lista
    console.log(uuid)
  }

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
      <h1 style={{ margin: '0' }}>Prueba Técnica</h1>
      <Results />
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
            {isFetchingNextPage ? (
              <Spinner />
            ) : hasNextPage ? (
              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                Cargar más usuarios
              </button>
            ) : (
              <p style={{ fontWeight: 'bold' }}>No hay más usuarios</p>
            )}
          </>
        )}
        {isLoading && <Spinner />}
        {isError && <p>{`Ha ocurrido un error: ${String(error)}`}</p>}
        {!isLoading && !error && !users.length && <p>No hay usuarios</p>}
      </main>
    </>
  )
}

export default App
