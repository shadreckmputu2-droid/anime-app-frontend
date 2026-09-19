import { useState, useEffect, FormEvent, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type Anime } from '../lib/api'

function handleTiltMove(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -8
  const rotateY = ((x - centerX) / centerX) * 8
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`
}

function handleTiltLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
}

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
      <div className="blob blob-1" />
      <div className="blob blob-2" />

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
          <Link
            key={a.id}
            to={`/anime/${a.id}`}
            className="anime-card"
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
          >
            {a.coverImageUrl && <img src={a.coverImageUrl} alt={a.title} />}
            <p className="anime-card-title">{a.title}</p>
          </Link>
        ))}
      </div>

      {!loading && anime.length === 0 && <p>No anime found.</p>}
    </div>
  )
}