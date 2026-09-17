import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, type NewsArticle } from '../lib/api'

export function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getNews()
      .then((res) => setArticles(res.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error) return <div className="page"><p className="form-error">{error}</p></div>

  return (
    <div className="page">
      <h1>News</h1>

      {articles.length === 0 && <p>No news articles yet.</p>}

      <div className="news-list">
        {articles.map((article) => (
          <Link key={article.id} to={`/news/${article.slug}`} className="news-card">
            <h3>{article.title}</h3>
            <p className="news-date">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            {article.summary && <p className="news-summary">{article.summary}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}