import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function TaskForm() {
  const { id } = useParams()
  const loc = useLocation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

  const { data: detail } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`/tasks?search=&status=all&page=1&limit=100`)
      return data.items.find(t => t._id === id) || null
    },
    enabled: !!id
  })

  useEffect(()=>{
    const t = loc.state?.task || detail
    if (t) {
      setTitle(t.title)
      setDescription(t.description)
      setStatus(t.status)
    }
  }, [detail, loc.state])

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/tasks', payload)
      return data.task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.put(`/tasks/${id}`, payload)
      return data.task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/')
    }
  })

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Title is required')
    const payload = { title, description, status }
    if (id) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-lg font-semibold mb-4">{id ? 'Edit Task' : 'New Task'}</h2>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input min-h-[120px]" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <div className="flex gap-2">
          <button className="btn" type="submit">{id ? 'Update' : 'Create'}</button>
          <button className="btn" type="button" onClick={()=>navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
