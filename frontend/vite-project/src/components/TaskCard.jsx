export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="card flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm opacity-80">{task.description}</p>
        <div className="mt-2">
          <span className={"badge " + (task.status === 'done' ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800")}>
            {task.status}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => onToggle(task)}>{task.status === 'done' ? 'Mark Pending' : 'Mark Done'}</button>
        <button className="btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  )
}
