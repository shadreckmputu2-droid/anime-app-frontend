import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, type WatchlistEntry } from '../lib/api'

export function Watchlist() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getWatchlist()
      setEntries(res)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleRemove(animeId: string) {
    await api.removeFromWatchlist(animeId)
    load()
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error) return <div className="page"><p className="form-error">{error}</p></div>

  return (
    <div className="page">
      <h1>My Watchlist</h1>

      {entries.length === 0 && <p>Nothing here yet — go add some anime!</p>}

      <div>
        {entries.map((entry) => (
          <div key={entry.id} className="watchlist-row">
            {entry.anime.coverImageUrl && (
              <img src={entry.anime.coverImageUrl} alt={entry.anime.title} />
            )}
            <div className="watchlist-info">
              <Link to={`/anime/${entry.anime.id}`}>{entry.anime.title}</Link>
              <p className="watchlist-status">
                {entry.status.replace(/_/g, ' ')} · Episode {entry.progress}
              </p>
            </div>
            <button className="secondary" onClick={() => handleRemove(entry.anime.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}