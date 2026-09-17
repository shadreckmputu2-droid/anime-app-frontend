const API_BASE = 'http://localhost:4000'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export interface AnimeGenreLink {
  genre: { id: string; name: string }
}

export interface Anime {
  id: string
  title: string
  titleEnglish: string | null
  synopsis: string | null
  episodes: number | null
  status: string
  coverImageUrl: string | null
  externalRating: number | null
  genres: AnimeGenreLink[]
}

export interface AnimeListResponse {
  items: Anime[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface WatchlistEntry {
  id: string
  animeId: string
  status: string
  userRating: number | null
  progress: number
  anime: Anime
}
export interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string | null
  body: string
  coverImageUrl: string | null
  publishedAt: string
}

export interface NewsListResponse {
  items: NewsArticle[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
export const api = {
  register: (data: { email: string; username: string; password: string }) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; email: string; username: string } }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  browseAnime: (params: { search?: string; genre?: string; page?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.genre) query.set('genre', params.genre)
    if (params.page) query.set('page', String(params.page))
    return request<AnimeListResponse>(`/api/anime?${query.toString()}`)
  },

  getAnime: (id: string) => request<Anime>(`/api/anime/${id}`),

  getWatchlist: () => request<WatchlistEntry[]>('/api/watchlist'),

  upsertWatchlist: (data: {
    animeId: string
    status?: string
    userRating?: number
    progress?: number
  }) => request<WatchlistEntry>('/api/watchlist', { method: 'POST', body: JSON.stringify(data) }),

  removeFromWatchlist: (animeId: string) =>
    request(`/api/watchlist/${animeId}`, { method: 'DELETE' }),
    removeFromWatchlist: (animeId: string) =>
    request(`/api/watchlist/${animeId}`, { method: 'DELETE' }),

  getNews: (page = 1) => request<NewsListResponse>(`/api/news?page=${page}`),

  getNewsArticle: (slug: string) => request<NewsArticle>(`/api/news/${slug}`),
}
