export default function Card({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {children}
    </div>
  )
}
