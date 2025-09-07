import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useQueryClient } from '@tanstack/react-query'

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', {name, email, password })
      await qc.invalidateQueries({ queryKey: ['me'] })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-lg font-semibold mb-4">Register</h2>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
       <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />  
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Create Account</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link className="underline" to="/login">Login</Link></p>
    </div>
  )
}
