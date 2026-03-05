'use client'

export function ExportCSVButton({ subscribers }: { subscribers: any[] }) {
  const handleExport = () => {
    const csv = ['Email,Subscribed At\n', ...subscribers.map(s => `${s.email},${s.created_at}\n`)].join('')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport} className="btn-outline py-2 px-6">
      Export CSV
    </button>
  )
}
