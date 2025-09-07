import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useQueryClient } from '@tanstack/react-query'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/login', { email, password })
      await qc.invalidateQueries({ queryKey: ['me'] })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Login</button>
      </form>
      <p className="text-sm mt-3">No account? <Link className="underline" to="/register">Register</Link></p>
    </div>
  )
}
