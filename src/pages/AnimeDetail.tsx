import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api, type Anime } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED']

export function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [status, setStatus] = useState('PLAN_TO_WATCH')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) api.getAnime(id).then(setAnime).catch((err) => setError(err.message))
  }, [id])

  async function handleAddToWatchlist() {
    if (!id) return
    setError(null)
    try {
      await api.upsertWatchlist({ animeId: id, status })
      setSaved(true)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (error) return <div className="page"><p className="form-error">{error}</p></div>
  if (!anime) return <div className="page"><p>Loading...</p></div>

  return (
    <div className="page">
      <div className="detail-layout">
        {anime.coverImageUrl && (
          <img src={anime.coverImageUrl} alt={anime.title} className="detail-cover" />
        )}
        <div>
          <h1 style={{ marginBottom: '0.2rem' }}>{anime.title}</h1>
          {anime.titleEnglish && anime.titleEnglish !== anime.title && (
            <p className="detail-meta">{anime.titleEnglish}</p>
          )}
          <p className="detail-meta">
            {anime.status} · Episodes: {anime.episodes ?? '?'}
            {anime.externalRating && <> · Rating: {anime.externalRating.toFixed(1)}</>}
          </p>
          <p className="detail-genres">
            {anime.genres.map((g) => g.genre.name).join(' · ')}
          </p>
          <p className="detail-synopsis">{anime.synopsis}</p>

          {user ? (
            <div className="detail-actions">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <button onClick={handleAddToWatchlist}>
                {saved ? 'Saved ✓' : 'Add to Watchlist'}
              </button>
            </div>
          ) : (
            <p className="detail-meta" style={{ marginTop: '1.5rem' }}>
              Log in to add this to your watchlist.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}