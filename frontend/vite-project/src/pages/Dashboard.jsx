import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import TaskCard from '../components/TaskCard.jsx'
import Pagination from '../components/Pagination.jsx'


function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const debouncedSearch = useDebounce(search, 300)


  const queryKey = ['tasks', debouncedSearch, status, page]

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearch,
        status,
        page,
        limit: 6
      })
      const { data } = await api.get(`/tasks?${params.toString()}`)
      return data
    },
    keepPreviousData: true
  })

  const toggleMutation = useMutation({
    mutationFn: async (task) => {
      const next = task.status === 'done' ? 'pending' : 'done'
      const { data } = await api.put(`/tasks/${task._id}`, { status: next })
      return data.task
    },
    onMutate: async (task) => {
      await qc.cancelQueries({ queryKey })
      const snapshot = qc.getQueryData(queryKey)
      qc.setQueryData(queryKey, old => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map(t =>
            t._id === task._id
              ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
              : t
          )
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(queryKey, ctx.snapshot)
    },
    onSettled: () => qc.invalidateQueries({ queryKey })
  })

  const deleteMutation = useMutation({
    mutationFn: async (task) => {
      await api.delete(`/tasks/${task._id}`)
    },
    onMutate: async (task) => {
      await qc.cancelQueries({ queryKey })
      const snapshot = qc.getQueryData(queryKey)
      qc.setQueryData(queryKey, old => {
        if (!old) return old
        return {
          ...old,
          items: old.items.filter(t => t._id !== task._id),
          total: Math.max(0, (old.total || 0) - 1)
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(queryKey, ctx.snapshot)
    },
    onSettled: () => qc.invalidateQueries({ queryKey })
  })

  if (isLoading) return <div className="card">Loading tasks...</div>
  if (isError) return <div className="card">Failed to load tasks.</div>

  return (
    <div className="space-y-4">
      <div className="card flex flex-col md:flex-row gap-3 items-center">
        <input
          className="input"
          placeholder="Search by title or description"
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value) }}
        />
        <select
          className="input max-w-xs"
          value={status}
          onChange={e => { setPage(1); setStatus(e.target.value) }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <button className="btn" onClick={() => navigate('/task')}>+ New Task</button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {data.items.map(task => (
          <TaskCard key={task._id}
            task={task}
            onToggle={(t) => toggleMutation.mutate(t)}
            onEdit={(t) => navigate(`/task/${t._id}`, { state: { task: t } })}
            onDelete={(t) => deleteMutation.mutate(t)}
          />
        ))}
      </div>

      <Pagination page={data.page} pages={data.pages} setPage={setPage} />
    </div>
  )
}
