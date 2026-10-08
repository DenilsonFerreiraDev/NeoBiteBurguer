export function AdminPageTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold text-balance">{title}</h1>
      </div>
      {action}
    </div>
  )
}
