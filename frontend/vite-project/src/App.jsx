/* eslint-disable no-unused-vars */
import { Outlet, Link, useNavigate } from 'react-router-dom'
import api from './api/axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function App() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me')
      return data.user
    },
    retry: false
  });

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) { /* ignore */ }
    qc.clear();
    navigate('/login');
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="text-xl font-bold">📝 Task Manager</Link>
        <nav className="flex items-center gap-3">
          {isLoading ? null : me ? (
            <>
              <span className="text-sm">Hi, {me?.name|| me?.email}</span>
              <Link to="/task" className="btn">New Task</Link>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
