import { Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Browse } from './pages/Browse'
import { AnimeDetail } from './pages/AnimeDetail'
import { Watchlist } from './pages/Watchlist'
import { NewsList } from './pages/NewsList'
import { NewsDetail } from './pages/NewsDetail'

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
      </Routes>
    </>
  )
}

export default App