import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api, type NewsArticle } from '../lib/api'

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      api.getNewsArticle(slug).then(setArticle).catch((err) => setError(err.message))
    }
  }, [slug])

  if (error) return <div className="page"><p className="form-error">{error}</p></div>
  if (!article) return <div className="page"><p>Loading...</p></div>

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1>{article.title}</h1>
      <p className="news-date">
        {new Date(article.publishedAt).toLocaleDateString()}
      </p>
      {article.coverImageUrl && (
        <img
          src={article.coverImageUrl}
          alt={article.title}
          style={{ width: '100%', borderRadius: 10, margin: '1rem 0' }}
        />
      )}
      <p className="detail-synopsis" style={{ maxWidth: 'none', whiteSpace: 'pre-wrap' }}>
        {article.body}
      </p>
    </div>
  )
}