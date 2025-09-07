export default function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null
  const prev = () => setPage(Math.max(1, page - 1))
  const next = () => setPage(Math.min(pages, page + 1))
  return (
    <div className="flex gap-2 items-center mt-4">
      <button className="btn" onClick={prev} disabled={page<=1}>Prev</button>
      <div className="text-sm">Page {page} of {pages}</div>
      <button className="btn" onClick={next} disabled={page>=pages}>Next</button>
    </div>
  )
}
