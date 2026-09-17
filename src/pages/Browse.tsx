import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type Anime } from '../lib/api'

export function Browse() {
  const [anime, setAnime] = useState<Anime[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load(searchTerm?: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.browseAnime({ search: searchTerm })
      setAnime(res.items)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    load(search)
  }

  return (
    <div className="page">
      <h1>Browse Anime</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="anime-grid">
        {anime.map((a) => (
          <Link key={a.id} to={`/anime/${a.id}`} className="anime-card">
            {a.coverImageUrl && <img src={a.coverImageUrl} alt={a.title} />}
            <p className="anime-card-title">{a.title}</p>
          </Link>
        ))}
      </div>
            {!loading && anime.length === 0 && <p>No anime found.</p>}
    </div>
  )
}